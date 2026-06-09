"use client";

import { PageView } from "../layout/PageView";
import { MarketChart } from "../charts/MarketChart";
import GlobalChip from "../common/GlobalChip";
import GlobalSearch from "./GlobalSearch";
import Ticker from "./Ticker";
import NormalCard from "../common/NormalCard";
import AdvanceTradingView from "./AdvanceTradingView";

export function ChartPageView() {
  const instrumentCode = "SQURPHARMA"
  return (
    <div className="container mx-auto px-4 md:px-[calc(10vw-3rem)] py-20 mt-16">
      <div className="flex items-center gap-10 mb-6">
        <GlobalChip />

        <div className="grow">
          <GlobalSearch />
        </div>
      </div>

      <div className="mb-6">
        <Ticker />
      </div>

      <NormalCard>
        <div className="p-2 h-[calc(100vh-200px)]">
          <AdvanceTradingView instrumentCode={instrumentCode} />
        </div>
      </NormalCard>
    </div>
  );
}
