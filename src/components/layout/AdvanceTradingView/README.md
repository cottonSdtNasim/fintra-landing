# Advance TradingView chart — how it works

This feature embeds **TradingView Advanced Charts** (the full charting library from `charting_library-master`), **not** the separate `lightweight-charts` npm package used elsewhere (`LightWeightCandle`). Your **end-of-day (EOD)** price and volume APIs power the chart through a small **custom datafeed** layer.

---

## High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  React: AdvanceTradingView (index.jsx)                          │
│  • Renders a div with a stable id (e.g. tv_adv_ACI)               │
│  • Loads TradingView script once → new TradingView.widget({...}) │
│  • Passes custom datafeed + paths to library + themed CSS         │
│  • On unmount: widget.remove()                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Browser loads (URLs stay the same; source differs by environment): │
│  • /charting_library/* — dev: public/charting_library (or vendor via plugin); │
│    production: Vite copies public/ → dist/ or plugin copies vendor path       │
│  • /tradingview-themed.css — from src/.../tradingview-themed.css │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Custom datafeed (tradingViewDatafeed.js)                        │
│  Implements TradingView’s IDatafeedChartApi:                    │
│  onReady, searchSymbols, resolveSymbol, getBars,                │
│  subscribeBars / unsubscribeBars                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Your API (lightweightChartApi.js — unchanged)                  │
│  • GET …/price-series?security_code=…                           │
│  • GET …/volume-series?security_code=…                          │
└─────────────────────────────────────────────────────────────────┘
```

The chart library runs **inside the page** (iframe internally). It calls **your datafeed** whenever it needs history; it does **not** talk to TradingView’s demo UDF servers for your symbol data.

---

## File roles

| File | Role |
|------|------|
| `index.jsx` | React shell: loading state, error state, container `id`, creates `TradingView.widget`, cleanup. |
| `loadTradingView.js` | Injects `<script src="/charting_library/charting_library.standalone.js">` once and exposes `ensureTradingViewScript()`. |
| `tradingViewDatafeed.js` | `createFintraDatafeed(securityCode)` — maps API JSON to TradingView `Bar` objects. |
| `style.css` | Layout: wrapper height so the chart has a defined area. |
| `tradingview-themed.css` | TV CSS variables; edit here, served at `/tradingview-themed.css`. |
| `../../api/CompanyDetails/lightweightChartApi.js` | Shared axios calls for price + volume series (same as `LightWeightCandle`). |
| `vite/tradingViewChartingLibraryPlugin.js` | Dev middleware + `npm run build` copies vendor lib into `dist/`. |

---

## How the datafeed maps your API to TradingView

1. **`onReady`**  
   Tells the library we only support **daily** resolutions: `1D` and `D`.

2. **`resolveSymbol`**  
   Describes the symbol (ticker name, `has_daily: true`, `has_intraday: false`, `pricescale`, etc.). The chart uses this for scales and UI.

3. **`getBars`** (main work)  
   - Calls `lightweightChartApi.getPriceSeries(security_code)` and `getVolumeSeries(security_code)` in parallel.  
   - Parses each row’s `time` string into **bar time in milliseconds** (TradingView requirement for daily bars).  
   - Joins volume to the same calendar day via a normalized date key (`YYYY-MM-DD` from `time`).  
   - Builds `{ time, open, high, low, close, volume }` bars, sorts by time.  
   - Filters to the requested range: `periodParams.from` / `to` are **Unix seconds**; `to` is **exclusive**, so bars satisfy `fromMs <= time < toMs`.  
   - If nothing matches, returns `[]` with `{ noData: true }`.

4. **`subscribeBars` / `unsubscribeBars`**  
   No-op: data is EOD only, not real-time streaming.

5. **`searchSymbols`**  
   Returns an empty list — symbol search in the header is disabled in the widget config so users stay on the current instrument.

---

## Widget options (why certain things are set)

In `index.jsx`, `new TradingView.widget({ ... })` includes:

- **`library_path: "/charting_library/"`** — Same URL in dev and prod; the Vite plugin serves or copies the folder from `charting_library-master/.../charting_library`.  
- **`custom_css_url: "/tradingview-themed.css"`** — Served from `src/.../tradingview-themed.css` (CSS variables for platform/toolbar/popup).  
- **`autosize: true`**, **`fullscreen: false`** — Chart fills the React container.  
- **`disabled_features`** — Hides symbol search and compare (no multi-symbol backend wired here); avoids localStorage for settings.  
- **`enabled_features: ["study_templates"]`** — Keeps study templates available if your license allows.  
- **`theme`** — `"light"` or `"dark"`; pairs with `:root` / `.theme-dark` rules in `tradingview-themed.css`.

---

## Setup: where to put `charting_library`

TradingView Advanced Charts is still the **full** upstream package (many files under `bundles/`, etc.). You cannot trim it to a few files in `src/` without breaking dynamic loads.

**Recommended:** put the complete folder at **`public/charting_library/`** (same layout as TradingView’s zip). Vite serves it at `/charting_library/` in dev and copies it to **`dist/charting_library/`** on build — no extra copy step.

**Alternative:** keep the library only under `charting_library-master/.../charting_library` or a flat `charting_library/` at the repo root; then **`vite/tradingViewChartingLibraryPlugin.js`** serves `/charting_library/*` in dev and copies it to `dist/` on build.

**Themed CSS:** either `public/tradingview-themed.css` or `src/.../AdvanceTradingView/tradingview-themed.css` (if not in `public`, the plugin serves/copies it).

**Your integration code (always in repo):** `tradingViewDatafeed.js`, `loadTradingView.js`, `index.jsx`.

---

## Where it is used

- **`OverviewTab`** uses `<AdvanceTradingView instrumentCode={instrumentCode} />` for company details.  
- You can reuse the same component anywhere you pass an **`instrumentCode`** (same as `security_code` for the MKT API).

### Props

| Prop | Default | Description |
|------|---------|-------------|
| `instrumentCode` | — | Required for data; used as `security_code` for API calls and as the chart symbol. |
| `theme` | `"light"` | Pass `"dark"` for dark theme (with matching `themed.css` rules). |

---

## Limitations and extensions

- **Only daily (EOD) data** — Your backend does not provide intraday bars; non-daily resolutions return `noData`. To support weekly/monthly, you’d either aggregate on the client or add APIs and extend `getBars`.  
- **No live streaming** — `subscribeBars` is empty until you add a websocket or polling and call the realtime callback.  
- **Symbol search** — Disabled in the widget; enabling it would require implementing `searchSymbols` with your backend.  
- **Licensing** — Ensure your use of TradingView Advanced Charts complies with TradingView’s license for your product.

---

## Comparison with `LightWeightCandle`

| | LightWeightCandle | AdvanceTradingView |
|---|-------------------|---------------------|
| Library | `lightweight-charts` (npm) | TradingView Advanced Charts (standalone bundle) |
| Features | Basic candle + volume | Full TV UI: studies, drawing tools, templates, etc. |
| Data | Same `lightweightChartApi` | Same API via custom datafeed |
| Bundle size | Smaller | Large vendor folder under `charting_library-master` (+ `dist/charting_library` after build) |

---

## Troubleshooting

1. **Blank chart / “Failed to load TradingView library”**  
   Confirm `public/charting_library/charting_library.standalone.js` exists, or a vendor path from the README. Hard-refresh the browser (cache).

2. **No candles**  
   Check network tab for `/mkt-day-end-data/price-series` and `volume-series`; verify `time` formats parse correctly and overlap the chart’s requested date range.

3. **Styles look wrong**  
   Edit `tradingview-themed.css` in this folder; dev serves it at `/tradingview-themed.css`.
