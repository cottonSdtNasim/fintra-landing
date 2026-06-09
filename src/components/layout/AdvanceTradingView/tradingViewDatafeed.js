// Custom datafeed implementation for TradingView Advanced Charts,
// tailored for Fintra MKT APIs which provide daily end-of-day (EOD) data only.

import { companyDetailsApi } from "../../../api/companyDetailsApi";
import { lightweightChartApi } from "../../../api/lightweightChartApi";

// import { lightweightChartApi } from "../../../api/CompanyDetails/lightweightChartApi";
// import { companyDetailsApi } from "../../../api/CompanyDetails/companyDetailsApi";

/**
 * Converts a value to a finite Number, or returns null if not finite.
 * Used to sanitize price/volume data from API responses.
 */
function toFiniteNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// ---------------------------------------------------------------------------
// Symbol-list cache (shared across all datafeed instances).
// We fetch /security-company-info once and reuse it for both searchSymbols
// and resolveSymbol so the TradingView search box is fast and offline-friendly.
// ---------------------------------------------------------------------------
const SYMBOL_LIST_TTL_MS = 5 * 60 * 1000; // refresh after 5 minutes
let symbolListPromise = null;
let symbolListCachedAt = 0;

/**
 * Maps one row from getSecurityCompanyInfo() into a TradingView search item.
 * TradingView expects: { symbol, full_name, description, exchange, ticker, type }.
 */
function mapCompanyRowToSymbol(row) {
  const code = String(row?.security_code || "")
    .trim()
    .toUpperCase();
  if (!code) return null;
  return {
    symbol: code,
    full_name: code,
    ticker: code,
    description: row?.company_name ? `${String(row.company_name)} - FINTRA` : code,
    exchange: "DSE",
    type: "stock",
    sector: row?.sector ? String(row.sector) : "",
  };
}

/**
 * Returns a cached promise that resolves to the full list of TradingView
 * search items derived from /security-company-info. Refreshes after TTL.
 */
function getSymbolList() {
  const now = Date.now();
  if (symbolListPromise && now - symbolListCachedAt < SYMBOL_LIST_TTL_MS) {
    return symbolListPromise;
  }
  symbolListCachedAt = now;
  symbolListPromise = (async () => {
    try {
      const res = await companyDetailsApi.getSecurityCompanyInfo();
      const rows = Array.isArray(res?.data) ? res.data : [];
      return rows.map(mapCompanyRowToSymbol).filter(Boolean);
    } catch (_e) {
      // Reset on failure so the next call retries instead of caching an empty list forever.
      symbolListPromise = null;
      symbolListCachedAt = 0;
      return [];
    }
  })();
  return symbolListPromise;
}

/**
 * Normalizes a date/time string into a date key (YYYY-MM-DD).
 * Used for merging price and volume rows coming from separate API endpoints.
 *
 * @param {string} timeStr - ISO date or date string from API
 * @returns {string} - Date key in 'YYYY-MM-DD' format
 */
function timeKey(timeStr) {
  return String(timeStr ?? "")
    .trim()
    .split("T")[0]; // Remove time part if present
}

/**
 * Parses a bar's open time (string) into a timestamp in milliseconds (UTC midnight of day).
 * Handles most ISO date and date-like strings. Falls back to Date.UTC if needed.
 *
 * @param {string} timeStr - The date or datetime string
 * @returns {number|null} - Timestamp in ms, or null if invalid
 */
function parseBarTimeMs(timeStr) {
  if (!timeStr) return null;
  const s = String(timeStr).trim();
  // Try constructing JS Date (handles ISO and most date-like strings)
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.getTime();
  // Fallback: manually parse parts for YYYY-MM-DD
  const p = s.split(/[-T:/ ]/).map((x) => parseInt(x, 10));
  if (p.length >= 3 && p.every((x) => !Number.isNaN(x))) {
    return Date.UTC(p[0], p[1] - 1, p[2]);
  }
  return null;
}

// Only allow daily resolutions natively. TV will build weekly/monthly from 1D.
const ALLOWED_RESOLUTIONS = ["1D", "1W", "3W", "1M", "3M", "6M", "12M"];

const dailyDataCache = new Map(); // code -> { promise, timestamp }
const DAILY_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function fetchAndCacheDailyData(code) {
  const now = Date.now();
  if (dailyDataCache.has(code)) {
    const cached = dailyDataCache.get(code);
    if (now - cached.timestamp < DAILY_CACHE_TTL) {
      return cached.promise;
    }
  }

  const promise = (async () => {
    // Fetch daily price and volume time series from our APIs in parallel
    const [priceRes, volRes] = await Promise.all([
      lightweightChartApi.getPriceSeries(code),
      lightweightChartApi.getVolumeSeries(code),
    ]);

    // Robustly handle possible bad responses
    const prices = Array.isArray(priceRes?.data) ? priceRes.data : [];
    const volumes = Array.isArray(volRes?.data) ? volRes.data : [];

    // Build a lookup map: date-key -> volume
    const volByKey = new Map();
    for (const row of volumes) {
      const k = timeKey(row.time);
      const v = toFiniteNumber(row.value);
      if (k && v != null) volByKey.set(k, v);
    }

    // Merge each price row with its corresponding volume (using date key)
    const bars = [];
    for (const p of prices) {
      const tMs = parseBarTimeMs(p.time);
      if (tMs == null) continue;
      // Clean up OHLC; skip if any are missing/invalid
      const o = toFiniteNumber(p.open);
      const h = toFiniteNumber(p.high);
      const l = toFiniteNumber(p.low);
      const c = toFiniteNumber(p.close);
      if (o == null || h == null || l == null || c == null) continue;

      // Find corresponding volume for this date, or use 0 as fallback
      const vk = timeKey(p.time);
      const vol = volByKey.has(vk) ? volByKey.get(vk) : 0;

      // Push bar in TradingView format
      bars.push({
        time: tMs, // ms timestamp
        open: o,
        high: h,
        low: l,
        close: c,
        volume: vol ?? 0,
      });
    }

    // Sort all bars chronologically by time (TradingView wants ascending)
    bars.sort((a, b) => a.time - b.time);
    return bars;
  })();

  dailyDataCache.set(code, { promise, timestamp: now });
  return promise;
}

/**
 * Factory to create a TradingView-compatible datafeed for Fintra daily data.
 * Only supports EOD daily candles.
 *
 * @param {string} securityCode - INSTRUMENT_CODE (API param)
 * @returns {object} - TradingView IDatafeedChartApi implementation
 */
export function createFintraDatafeed(securityCode) {
  // Use provided securityCode, fallback to "—" as an unavailable marker
  const ticker = securityCode || "—";

  return {
    /**
     * Notifies TradingView of which resolutions and features are supported.
     * Only "1D"/"D" bars (daily). No marks, timescale marks or intraday.
     * Called once by TradingView on widget load.
     */
    onReady(callback) {
      setTimeout(() => {
        callback({
          supported_resolutions: ALLOWED_RESOLUTIONS, // Daily, Weekly, Monthly
          supports_marks: false, // No marks
          supports_timescale_marks: false, // No timescale marks
          supports_time: false, // No server time
        });
      }, 0); // async for TradingView contract
    },

    /**
     * Symbol search API.
     * Backed by /security-company-info — matches the user's query against
     * security_code and company_name (case-insensitive). Results are capped
     * so the TradingView search popup stays responsive on large universes.
     */
    async searchSymbols(userInput, _exchange, symbolType, onResult) {
      try {
        const list = await getSymbolList();
        const q = String(userInput || "")
          .trim()
          .toUpperCase();

        const matchesType = symbolType
          ? list.filter((s) => s.type === symbolType)
          : list;

        const filtered = q
          ? matchesType.filter(
              (s) =>
                s.symbol.includes(q) || s.description.toUpperCase().includes(q),
            )
          : matchesType;

        // Rank exact/prefix matches on the symbol code first.
        filtered.sort((a, b) => {
          const ax = a.symbol === q ? 0 : a.symbol.startsWith(q) ? 1 : 2;
          const bx = b.symbol === q ? 0 : b.symbol.startsWith(q) ? 1 : 2;
          if (ax !== bx) return ax - bx;
          return a.symbol.localeCompare(b.symbol);
        });

        onResult(filtered.slice(0, 50));
      } catch (_e) {
        onResult([]);
      }
    },

    /**
     * Symbol resolve: tells TradingView how to interpret a ticker/name.
     * Looks up the company name/sector from the cached symbol list (if available)
     * so the chart header shows a meaningful description after symbol search.
     */
    async resolveSymbol(symbolName, onResolve, onError) {
      try {
        const requested = String(symbolName || ticker || "")
          .trim()
          .toUpperCase();

        let match = null;
        try {
          const list = await getSymbolList();
          match = list.find((s) => s.symbol === requested) || null;
        } catch (_e) {
          // Non-fatal: still resolve the symbol even if the list lookup fails.
        }

        onResolve({
          name: requested,
          ticker: requested,
          description: match?.description || requested,
          type: "stock",
          session: "1000-1430:12345", // No market open/close, sun to thursday 10:00 to 14:30
          timezone: "Asia/Dhaka",
          exchange: "DSE",
          listed_exchange: "DSE",
          minmov: 1, // Smallest price movement (1 in units of pricescale)
          pricescale: 100, // Price precision: 2 decimal places (1234 = 12.34)
          has_intraday: false,
          has_daily: true,
          has_weekly_and_monthly: false,
          visible_plots_set: "ohlcv",
          supported_resolutions: ALLOWED_RESOLUTIONS,
          volume_precision: 0,
          data_status: "endofday",
          format: "price", // Chart price format
        });
      } catch (e) {
        // If anything fails, provide error to TradingView
        onError(e?.message || "resolveSymbol failed");
      }
    },

    /**
     * Main history loading function:
     * TradingView calls this to load bars between a time range for the current symbol/resolution.
     * We fetch *all* price and volume data in parallel and then join/normalize/bucket client-side.
     * Note: Only "1D"/"D" supported (checked upfront).
     */
    getBars(symbolInfo, resolution, periodParams, onResult, onError) {
      (async () => {
        try {
          // TV will request "1D" or "D" even for weekly/monthly if has_weekly_and_monthly is false.
          // We check if the requested resolution is supported or is the standard "D".
          if (!ALLOWED_RESOLUTIONS.includes(resolution) && resolution !== "D") {
            onResult([], { noData: true });
            return;
          }

          // TradingView provides a [from, to) UNIX seconds range
          const fromSec = periodParams.from;
          const toSec = periodParams.to;
          const fromMs = fromSec * 1000;
          const toMs = toSec * 1000;

          // Use the symbol the chart is currently displaying (may differ from
          // the initial ticker if the user picked a new one from symbol search).
          const code = String(
            symbolInfo?.ticker || symbolInfo?.name || ticker || "",
          ).trim();

          // Fetch bars from cache (or API if not cached)
          const bars = await fetchAndCacheDailyData(code);

          // Filter bars to the requested [from, to) time window
          const filtered = bars.filter(
            (b) => b.time >= fromMs && b.time < toMs,
          );

          // Send result to TradingView: either bars or an empty "noData" response
          if (filtered.length === 0) {
            onResult([], { noData: true });
          } else {
            onResult(filtered, { noData: false });
          }
        } catch (e) {
          // If anything fails (API/network/processing), report back to TV
          onError(e?.message || "getBars failed");
        }
      })();
    },

    /**
     * Bar subscription (realtime stream) — not implemented, as we are EOD-only.
     * TradingView expects this to exist, even if it's a stub.
     */
    subscribeBars(_si, _res, _onTick, _guid, _onReset) {
      // EOD only — no real streaming!
    },

    /**
     * Unsubscribe: no-op for us since we never start a stream.
     */
    unsubscribeBars(_guid) {
      // no-op
    },
  };
}
