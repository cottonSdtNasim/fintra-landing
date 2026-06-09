# API JSON formats for Advance TradingView (minute, day, year)

This document describes how to shape **backend JSON** for the Fintra Advanced TradingView integration. The chart’s datafeed (`tradingViewDatafeed.js`) loads **two** endpoints and merges them:

| Endpoint pattern | Purpose |
|------------------|---------|
| `GET …/price-series?security_code=…` | OHLC per bar |
| `GET …/volume-series?security_code=…` | Volume per bar |

Implementations live in `src/api/CompanyDetails/lightweightChartApi.js`.

---

## 1. Response envelope (both endpoints)

Use the same top-level shape the client already handles:

```json
{
  "success": true,
  "message": "optional human-readable status",
  "data": [ /* array of rows — see below */ ]
}
```

On failure, returning `{ "success": false, "data": [] }` is consistent with existing error handling.

**Field types:**

- **`time`**: string that JavaScript `new Date(time)` parses reliably (ISO-8601 recommended).
- **OHLC in price rows**: strings or numbers — the feed converts with `Number(...)`.
- **`value` (volume rows)**: same.

---

## 2. Aligning rows for the merge

The feed builds a volume map keyed from `time`, then walks each price row and attaches volume. **The same semantic bar** must use the **same `time` string** (or equivalent after normalization) in **both** `price-series` and `volume-series`.

**Daily example:** `"2026-05-01"` in both.

**Minute example:** `"2026-05-05T09:15:00+06:00"` in both — use one timezone convention everywhere (e.g. always `+06:00` or always `Z`).

**Year example:** Pick one convention, e.g. bar open at **`YYYY-01-01`** for calendar-year bars in both endpoints.

---

## 3. Current frontend caveat (minute & custom keys)

In `tradingViewDatafeed.js`, `timeKey()` currently keeps only the **date** part (`split("T")[0]`) when merging volume into OHLC rows. That is fine for **one bar per calendar day**.

For **minute** (or any intraday) bars, **many rows share the same calendar date**, so merging by date-only **collapses** volumes incorrectly. Supporting minutes requires merging on a **full datetime key** (e.g. normalized ISO minute string or epoch ms derived from each row’s `time`). Until that is implemented, backend JSON can still follow the formats below — the frontend merge logic must match the granularity.

The bar **timestamp** passed to TradingView uses `parseBarTimeMs()`, which accepts full ISO datetimes for intraday bars.

---

## 4. Minute-wise JSON examples

Bars are **one row per interval** (e.g. 1-minute). Use a **timezone-aware** ISO string so open/close semantics are stable.

### `price-series`

```json
{
  "success": true,
  "data": [
    {
      "time": "2026-05-05T09:15:00+06:00",
      "open": "125.4000",
      "high": "125.9000",
      "low": "125.2000",
      "close": "125.7500"
    },
    {
      "time": "2026-05-05T09:16:00+06:00",
      "open": "125.7500",
      "high": "126.1000",
      "low": "125.6000",
      "close": "125.9500"
    }
  ]
}
```

### `volume-series`

```json
{
  "success": true,
  "data": [
    { "time": "2026-05-05T09:15:00+06:00", "value": "18420" },
    { "time": "2026-05-05T09:16:00+06:00", "value": "9931" }
  ]
}
```

**Backend tips:**

- Emit rows in chronological order when possible (the feed sorts anyway).
- One `time` per minute bucket; duplicates for the same key should be avoided.

---

## 5. Day-wise (EOD) JSON examples

One row **per trading/session day**.

### `price-series`

```json
{
  "success": true,
  "data": [
    {
      "time": "2026-05-01",
      "open": "120.0000",
      "high": "122.5000",
      "low": "119.7500",
      "close": "121.8000"
    },
    {
      "time": "2026-05-02",
      "open": "121.8000",
      "high": "123.0000",
      "low": "121.1000",
      "close": "122.4500"
    }
  ]
}
```

### `volume-series`

```json
{
  "success": true,
  "data": [
    { "time": "2026-05-01", "value": "450000" },
    { "time": "2026-05-02", "value": "512300" }
  ]
}
```

`"2026-05-01"` or `"2026-05-01T00:00:00Z"` both parse; stay consistent across both endpoints.

---

## 6. Year-wise JSON examples

One row **per year** (your backend aggregates OHLC/volume per year). Use a **`time`** that identifies the period unambiguously; **`YYYY-01-01`** is a simple convention if you treat rows as calendar-year bars.

### `price-series`

```json
{
  "success": true,
  "data": [
    {
      "time": "2024-01-01",
      "open": "88.5000",
      "high": "102.3000",
      "low": "86.9000",
      "close": "99.7500"
    },
    {
      "time": "2025-01-01",
      "open": "99.7500",
      "high": "115.4000",
      "low": "97.2000",
      "close": "110.2500"
    }
  ]
}
```

### `volume-series`

```json
{
  "success": true,
  "data": [
    { "time": "2024-01-01", "value": "125000000" },
    { "time": "2025-01-01", "value": "138500000" }
  ]
}
```

---

## 7. What the datafeed sends to TradingView (after merge)

TradingView expects each bar roughly as:

```json
{
  "time": 1717568100000,
  "open": 125.4,
  "high": 125.9,
  "low": 125.2,
  "close": 125.75,
  "volume": 18420
}
```

In this project, **`time` is unix time in milliseconds** (from `parseBarTimeMs` in `tradingViewDatafeed.js`). OHLC/volume are **numbers**.

---

## 8. Connecting granularity to TradingView resolutions

TradingView selects a **resolution** (e.g. `1`, `5`, `60`, `1D`, yearly). Your frontend must:

1. Declare **`supported_resolutions`** in `onReady` / `resolveSymbol` for the granularities you support.
2. In **`getBars`**, branch on **`resolution`** and either:
   - call different API query params (`interval=1m` / daily / yearly), or
   - return daily data and rely on TradingView aggregation (limited for non-standard cases), or
   - precompute yearly series on the server and return those rows when resolution is yearly.

The **JSON shapes** above stay the same: only the **density** of `data` arrays and **`time`** semantics change.

---

## 9. Quick checklist

| Granularity | `time` examples | Same `time` on price + volume |
|-------------|-----------------|--------------------------------|
| Minute | `2026-05-05T09:15:00+06:00` | Required; update merge key in feed for intraday |
| Day | `2026-05-01` | Required |
| Year | `2024-01-01` (or your chosen bar anchor) | Required |

Validated OHLC (`open`, `high`, `low`, `close`) must be finite; invalid rows may be skipped. Missing volume can default to **0** after merge if no matching volume row exists.
