import React, { useEffect, useMemo, useRef, useState } from "react";
import { createFintraDatafeed } from "./tradingViewDatafeed";
import { ensureTradingViewScript } from "./loadTradingView";
import "./style.css";
import { defaultOverrides, defaultStudiesOverrides, defaultToolsOverrides } from "./chartColor";

function sanitizeDomId(raw) {
  return String(raw || "chart").replace(/[^a-zA-Z0-9_-]/g, "_");
}

/**
 * TradingView Advanced Charts (full library) with Fintra EOD data + themed CSS.
 * Library: prefer `public/charting_library/`; else vendor path — see vite/tradingViewChartingLibraryPlugin.js.
 * Theme overrides: ./tradingview-themed.css (served as /tradingview-themed.css).
 */
export default function AdvanceTradingView({
  instrumentCode,
  theme = "dark",
}) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  const containerId = useMemo(
    () => `tv_adv_${sanitizeDomId(instrumentCode)}`,
    [instrumentCode],
  );

  useEffect(() => {
    if (!instrumentCode) {
      setStatus({ loading: false, error: null });
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      setStatus({ loading: true, error: null });
      try {
        await ensureTradingViewScript();
        if (cancelled || !containerRef.current || !window.TradingView) return;

        const datafeed = createFintraDatafeed(instrumentCode);

        const w = new window.TradingView.widget({
          // symbol: `${instrumentCode} - Fintra`,
          symbol: instrumentCode,
          interval: "1D",
          container: containerId,
          datafeed,
          library_path: "/charting_library/",
          locale: "en",
          theme: theme === "dark" ? "dark" : "light",
          custom_css_url: "/tradingview-themed.css",
          autosize: true,
          fullscreen: false,
          // Render the time axis in Bangladesh time. Must be a valid IANA id
          // supported by TradingView; "Asia/Dhaka" is supported out of the box.
          timezone: "Asia/Dhaka",
          disabled_features: [
            "use_localstorage_for_settings",
            "header_compare",
          ],
          enabled_features: ["study_templates"],
          overrides: defaultOverrides,
          studies_overrides: defaultStudiesOverrides,
        });

        w.onChartReady(() => {
          /* Fibonacci Retracement */
          w.applyOverrides(defaultToolsOverrides);
        });

        widgetRef.current = w;
        if (!cancelled) setStatus({ loading: false, error: null });
      } catch (e) {
        if (!cancelled) {
          setStatus({
            loading: false,
            error: e?.message || "Could not load chart",
          });
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      if (widgetRef.current && typeof widgetRef.current.remove === "function") {
        try {
          widgetRef.current.remove();
        } catch {
          /* ignore */
        }
      }
      widgetRef.current = null;
    };
  }, [instrumentCode, containerId, theme]);

  if (!instrumentCode) {
    return (
      <div className="advance-tv-empty w-full h-full text-light_gray_text_color text-sm p-4">
        Select a company to load the chart.
      </div>
    );
  }

  return (
    <div className="advance-tv-root w-full h-full flex flex-col relative rounded-md overflow-hidden">
      {status.loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-cus_white_color/80 text-sm text-light_gray_text_color">
          Loading chart…
        </div>
      )}
      {status.error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-cus_white_color p-4 text-center text-sm text-light_red_color">
          {status.error}
        </div>
      )}
      <div
        ref={containerRef}
        id={containerId}
        className="advance-tv-container flex-1 w-full min-h-0"
      />
    </div>
  );
}
