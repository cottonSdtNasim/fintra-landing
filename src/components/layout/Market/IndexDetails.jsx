"use client";
import { useEffect, useRef, useState } from "react";
import { fetchMarketIndexSnapshotLate } from "../../../api/indexValueApi";
import { Typography } from "../../common/Typography";
import Tabs from "../../common/Tabs";
import PriceChangeIndicator from "../../common/PriceChangeIndicator";
import { FiClock } from "react-icons/fi";
import { LuDot } from "react-icons/lu";
import AreaLineChart from "./AreaLineChart/AreaLineChart";
const TABS = [
  { id: "dsex", label: "DSEX" },
  { id: "ds30", label: "DS30" },
  { id: "dses", label: "DSES" },
];

function fmt2(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x.toFixed(2) : "-";
}

function niceStep(rawStep) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const r = rawStep / pow;
  const nice = r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10;
  return nice * pow;
}

function buildMetric(values, count = 6) {
  const nums = values.map(Number).filter(Number.isFinite);
  if (nums.length === 0) return [];
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  if (min === max) {
    min = min - 1;
    max = max + 1;
  }
  const step = niceStep((max - min) / (count - 1));
  const start = Math.floor(min / step) * step;
  return Array.from({ length: count }, (_, i) => start + i * step);
}

const DHAKA_TZ = "Asia/Dhaka";
const INDEX_SNAPSHOT_POLL_MS = 60_000;

/** Dhaka (GMT+6) wall clock: 10:00 through 15:00 inclusive — poll index snapshot every minute in this window. */
function isDhakaIndexSnapshotPollingWindow(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const total = hour * 60 + minute;
  return total >= 10 * 60 && total <= 15 * 60;
}

export default function IndexDetailsPageView() {
  const [activeTab, setActiveTab] = useState("dsex");
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchSnapshot = async () => {
      try {
        const response = await fetchMarketIndexSnapshotLate();
        if (!mounted) return;
        setSnapshot(response || null);
      } catch (error) {
        console.error("Failed to fetch market snapshot:", error);
      }
    };

    fetchSnapshot();

    const intervalId = setInterval(() => {
      if (!isDhakaIndexSnapshotPollingWindow()) return;
      fetchSnapshot();
    }, INDEX_SNAPSHOT_POLL_MS);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const active = snapshot?.data?.[activeTab] || null;
  const overall = active?.overall_data || null;
  const realtime = Array.isArray(active?.realtime_data)
    ? active.realtime_data
    : [];

  const price = Number(overall?.price);
  const change = Number(overall?.change);
  const changePer = Number(overall?.change_per);

  const sign =
    !Number.isFinite(change) || change === 0 ? 0 : change > 0 ? 1 : -1;

  const latestTick = realtime.length ? realtime[realtime.length - 1] : null;
  const metaDate = snapshot?.meta?.date || null;

  const chartValues = realtime.map((r) => r?.value);
  const metric = buildMetric(
    chartValues.length ? chartValues : [price].filter(Number.isFinite),
  );
  const chartData = realtime.map((r) => {
    const full = String(r?.timestamp ?? r?.time ?? "").trim();
    const parts = full.split(/\s+/);
    const axisLabel = parts.length > 1 ? parts[parts.length - 1] : full;
    // hide seconds if time is in HH:MM:SS format, show full timestamp otherwise
    const timeParts = axisLabel.split(":");
    const finalAxisLabel =
      timeParts.length === 3 ? timeParts.slice(0, 2).join(":") : axisLabel;
    return {
      label: finalAxisLabel,
      tooltipLabel: full || finalAxisLabel,
      bars: [{ value: Number(r?.value) }],
    };
  });
  const chartColor =
    sign >= 0 ? ["var(--tertiary-green)"] : ["var(--primary-red)"];

  return (
    <div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="">
          <Tabs
            layoutScopeId="index_details"
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            width="w-full"
            pt="pt-0"
          />
        </div>

        <div className="p-4">
          {/* Price and Changes */}
          <div className="flex items-end gap-2 mb-2 ">
            {/* <div>
              <h1 className="text-[33px] leading-[33px] font-medium text-light_black_color">
                {fmt2(price)}
              </h1>
            </div> */}
            <Typography
              variant="h2"
              className="font-medium text-(--primary-white) my-auto"
            >
              {fmt2(price)}
            </Typography>

            <div
              className={`flex items-center px-3 py-2 gap-1 rounded-full 
                ${sign > 0 ? "bg-(--tertiary-green) text-black" : "bg-(--primary-red) text-(--primary-white)"}`}
            >
              <PriceChangeIndicator
                sign={sign}
                className={`w-2.5 h-2.5 font-medium 
                ${sign > 0 ? " text-black" : " text-(--primary-white)"}`}
              />

              <Typography variant="text12" className="font-medium">
                {sign > 0 ? "+" : ""}
                {fmt2(change)}
              </Typography>

              <Typography variant="text12" className="font-medium">
                ({sign > 0 ? "+" : ""}
                {Number.isFinite(changePer) ? changePer.toFixed(2) : "-"}%)
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-4">
            <FiClock className="text-(--secondary-white) text-sm" />
            <Typography variant="text14" className=" text-(--secondary-white)">
              {metaDate ?? "-"}
            </Typography>
            <LuDot className="text-(--secondary-white) " />
            <Typography variant="text14" className=" text-(--secondary-white)">
              {latestTick?.timestamp ?? latestTick?.time ?? "-"}
            </Typography>
          </div>

          <div className="mb-4 h-[300px] w-full">
            {/* {sign > 0 ? (
              <img src={graphImgPos} alt="Positive Graph" className="w-full h-auto" />
            ) : (
              <img src={graphImgNeg} alt="Negative Graph" className="w-full h-auto" />
            )} */}

            <AreaLineChart
              metric={metric}
              data={chartData}
              colorPalette={chartColor}
              intervalType={"time"}
              interval={30 * 60} // 30 minutes in seconds
              intervalStart={"10:00"}
            />
          </div>

          <div
            className={`grid gap-4 
              ${
                activeTab === "dsex"
                  ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
                  : "sm:grid-cols-3"
              } 
            `}
          >
            {activeTab === "dsex" && (
              <>
                <div
                  className={`p-4 rounded-md 
                ${sign > 0 ? "bg-(--tertiary-green)" : "bg-(--primary-red)"} 
              `}
                >
                  <Typography
                    variant="text12"
                    className={`mb-2 font-medium ${sign > 0 ? "text-black" : "text-(--primary-white)"}`}
                  >
                    Total Value (Cr)
                  </Typography>
                  <Typography
                    variant="p"
                    className={`font-medium ${sign > 0 ? "text-black" : "text-(--primary-white)"}`}
                  >
                    {overall?.total_value != null
                      ? fmt2(overall.total_value)
                      : "-"}
                  </Typography>
                </div>

                <div className="p-4 bg-(--sixth-green) rounded-md">
                  <Typography variant="text12" className="mb-2">
                    Total Traded
                  </Typography>
                  <Typography variant="p" className="font-medium">
                    {overall?.total_traded ?? "-"}
                  </Typography>
                </div>

                <div className="p-4 bg-(--sixth-green) rounded-md">
                  <Typography variant="text12" className="mb-2 font-medium">
                    Total Volume
                  </Typography>
                  <Typography variant="p" className="font-medium">
                    {overall?.total_volume ?? "-"}
                  </Typography>
                </div>
              </>
            )}

            <div className="p-4 bg-(--sixth-green) rounded-md">
              <Typography variant="text12" className="mb-2 font-medium">
                Day Open
              </Typography>
              <Typography variant="p" className="font-medium">
                {fmt2(overall?.open)}
              </Typography>
            </div>

            <div className="p-4 bg-(--sixth-green) rounded-md">
              <Typography variant="text12" className="mb-2 font-medium">
                Day High
              </Typography>
              <Typography variant="p" className="font-medium">
                {fmt2(overall?.high)}
              </Typography>
            </div>

            <div className="p-4 bg-(--sixth-green) rounded-md">
              <Typography variant="text12" className="mb-2 font-medium">
                Day Low
              </Typography>
              <Typography variant="p" className="font-medium">
                {fmt2(overall?.low)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
