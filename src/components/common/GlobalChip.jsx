import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NormalChip from "./NormalChip";
import PriceChangeIndicator from "./PriceChangeIndicator";
import { Typography } from "./Typography";
import { fetchMarketIndexSnapshotLate } from "../../api/indexValueApi";

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

export default function GlobalChip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState(null);
  const indexInfo = data?.[currentIndex];

  function FormatData(data) {
    return ["dsex", "ds30", "dses"].map((key) => ({
      name: key.toUpperCase(),
      value: data?.[key]?.overall_data?.price ?? 0,
      change: data?.[key]?.overall_data?.change ?? 0,
      changePercent: data?.[key]?.overall_data?.change_per ?? 0,
    }));
  }

  console.log(data)

  useEffect(() => {
    const interval = setInterval(() => {
      if (data) setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    let mounted = true;

    const fetchSnapshot = async () => {
      try {
        const response = await fetchMarketIndexSnapshotLate();
        if (!mounted) return;

        if (response?.data)
          setData(FormatData(response.data));
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

  const positive = indexInfo?.changePercent > 0;
  const negative = indexInfo?.changePercent < 0;
  const changeTextClass = positive
    ? "text-(--tertiary-green)"
    : negative
      ? "text-(--primary-red)"
      : "text-(--secondary-white)";

  return (
    <div>

      <NormalChip>
        <div className="px-2.5 py-1">
          <div className="flex justify-between gap-6">
            <div className="flex items-center gap-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ rotateX: -70, opacity: 0.7, scale: 0.9, y: -1 }}
                  animate={{ rotateX: 0, opacity: 1, scale: 1, y: 0 }}
                  exit={{ rotateX: 55, opacity: 0.7, scale: 0.9, y: 1 }}
                  transition={{ duration: 0.3, ease: [0.32, 0, 0.67, 0] }}
                  style={{
                    width: "30px",
                    transformOrigin: "50% 70%",
                    transformStyle: "preserve-3d",
                    perspective: "400px",
                  }}
                >
                  <Typography
                    variant="text12"
                    className="text-[11px] text-(--secondary-white)"
                  >
                    {indexInfo?.name}
                  </Typography>
                </motion.div>
              </AnimatePresence>

              <PriceChangeIndicator
                sign={indexInfo?.changePercent.toFixed(2)}
                className={`w-2.5 h-2.5 ${changeTextClass}`}
              />
            </div>

            <Typography
              variant="text12"
              className={`text-[11px] ${changeTextClass}`}
            >
              {positive ? "+" : ""}
              {indexInfo?.changePercent.toFixed(2)}%
            </Typography>
          </div>

          <div className="flex justify-between gap-6">
            <Typography
              variant="text12"
              className="text-[11px] text-(--secondary-white)"
            >
              {indexInfo?.value.toFixed(2)}
            </Typography>

            <Typography
              variant="text12"
              className={`text-[11px] ${changeTextClass}`}
            >
              {indexInfo?.change > 0 ? "+" : ""}
              {indexInfo?.change.toFixed(2)}
            </Typography>
          </div>
        </div>
      </NormalChip >

    </div >
  );
}