// This variable holds a single Promise instance for loading the TradingView library script.
// It ensures that multiple calls to ensureTradingViewScript() don't load the script multiple times.
let scriptPromise = null;

/**
 * Loads `/charting_library/charting_library.standalone.js` once.
 * In dev, prefer `public/charting_library/` (Vite static); else vendor path via plugin. Build → dist/charting_library.
 * 
 * Returns a Promise that resolves when the script is loaded and `window.TradingView` is available.
 * 
 * Usage:
 *   await ensureTradingViewScript();
 * 
 * How it works:
 * - If not running in a browser (e.g. SSR), it rejects immediately.
 * - If the TradingView global is already present, it resolves immediately (already loaded).
 * - If the script is in the process of loading (scriptPromise exists), returns the same promise.
 * - Else, attaches the script to the document and resolves/rejects appropriately.
 */
export function ensureTradingViewScript() {
  // 1. Environment check: Only run in a browser, never in SSR/node contexts.
  if (typeof window === "undefined") {
    // Fail fast for server-side usage; TradingView is browser-only.
    return Promise.reject(new Error("TradingView requires a browser environment"));
  }

  // 2. If the TradingView library is already loaded globally on the window, resolve immediately.
  if (window.TradingView) {
    return Promise.resolve();
  }

  // 3. If we haven't yet kicked off a script load, start one.
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      // Check if a compatible script tag is already present in the DOM.
      const existing = document.querySelector("script[data-fintra-tradingview]");

      if (existing) {
        // The script element exists. If the library is ready, resolve immediately.
        if (window.TradingView) {
          resolve();
        } else {
          // Otherwise, listen for it to finish loading or erroring.
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () =>
            reject(new Error("TradingView script failed")),
          );
        }
        return;
      }

      // No existing script tag, so create a new script element.
      const s = document.createElement("script");
      // Served by vite/tradingViewChartingLibraryPlugin.js (dev) or copied to dist/ (build).
      s.src = "/charting_library/charting_library.standalone.js";
      s.async = true;
      // Custom data attribute to make it easy to find/avoid duplicates in the DOM.
      s.dataset.fintraTradingview = "1";
      // On successful loading, resolve the promise.
      s.onload = () => resolve();
      // On error, reject the promise with a helpful message.
      s.onerror = () =>
        reject(
          new Error(
            "Failed to load TradingView library. Add public/charting_library/ or a vendor charting_library folder.",
          ),
        );
      // Attach the script to the document <head> to begin loading.
      document.head.appendChild(s);
    });
  }

  // Return the (possibly in-progress) promise, so awaiting code is reliably notified.
  return scriptPromise;
}
