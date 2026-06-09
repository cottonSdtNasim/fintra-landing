"use client";

import GaugeChart from "./Market/GaugeChart/GaugeChart";
import ValueMap from "./Market/ValueMap";
import Overview from "./Market/Overview";
import SectorList from "./Market/SectorList";
import TopTenShares from "./Market/TopTenShares";
import LatestNews from "./Market/LatestNews";
import NormalCard from "../common/NormalCard";
import TickerSearch from "./TickerSearch";
import IndexDetails from "./Market/IndexDetails";
// import TsetView from "./Market/Test";

export function MarketPageView() {
  return (
    <div className="container mx-auto px-4 md:px-[calc(10vw-3rem)] py-20 mt-16">
      <TickerSearch />

      {/* Top 3 Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto mb-6">
        {/* Gauge Chart */}
        <NormalCard
          title="Market Sentiment"
          tooltip="Current market sentiment index"
        >
          <GaugeChart />
        </NormalCard>

        {/* Overview */}
        <NormalCard
          title="Market Overview"
          tooltip="Overall market performance"
        >
          <Overview />
        </NormalCard>

        {/* Sector List */}
        <NormalCard
          title="Sector Overview"
          tooltip="Performance by individual sectors"
        >
          <SectorList />
        </NormalCard>
      </div>
      <div className="col-span-3 mb-6">
        <NormalCard title="Index Value" tooltip="Index Value">
          <IndexDetails />
        </NormalCard>
      </div>

      <div className="col-span-3 mb-6">
        <NormalCard title="Top Ten Shares" tooltip="Top Ten Shares">
          <TopTenShares />
        </NormalCard>
      </div>
      <div className="col-span-3 mb-6">
        <NormalCard title="Value Map" tooltip="Value Map">
          <ValueMap />
        </NormalCard>
      </div>
      <div className="col-span-3 mb-6">
        <NormalCard title="Latest News" tooltip="Latest News">
          <LatestNews />
        </NormalCard>
      </div>

      {/* test */}
      {/* <div className="col-span-3 mb-6">
        <NormalCard title="Test" tooltip="Test">
          <TsetView />
        </NormalCard>
      </div> */}
    </div>
  );
}
