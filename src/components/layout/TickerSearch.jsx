"use client";
import GlobalChip from "../common/GlobalChip";
import GlobalSearch from "./GlobalSearch";
import Ticker from "./Ticker";

export default function TickerSearch() {
  return (
    // container mx-auto px-4 py-32 relative z-10 min-h-screen
    <div>
      <div className="flex items-center gap-10 mb-6">
        <GlobalChip />

        <div className="grow">
          <GlobalSearch />
        </div>
      </div>

      <div className="mb-6">
        <Ticker />
      </div>
    </div>
  );
}
