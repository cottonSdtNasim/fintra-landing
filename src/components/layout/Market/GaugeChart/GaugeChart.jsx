"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ellipseSvg from "../../../../../public/Gauge-Chart-Ellipse.svg";
import needleSvg from "../../../../../public/Gauge-Chart-Needle.svg";
import { Typography } from "../../../common/Typography";
import { marketOverviewApi } from "../../../../api/marketOverviewApi";

const MIN_NEEDLE_ANGLE = 0;
const MAX_NEEDLE_ANGLE = 180;
const SENTIMENT_POLL_INTERVAL = 30 * 1000; // 30 seconds

/**
 * Single Bear/Bull gauge chart. Value 0–100 from sentiment API; refreshes every 2 min.
 */
export default function GaugeChart() {
  const needleRef = useRef(null);
  const [value, setValue] = useState(100 / 2);
  const [label, setLabel] = useState("—");
  const [score, setScore] = useState("—");

  const fetchSentiment = useCallback(async () => {
    try {
      const res = await marketOverviewApi.getMarketSentiment();
      // Handle both { status: true, data: {...} } and { status: "ok", data: {...} }
      if (res && res.data && !Array.isArray(res.data)) {
        const { value: v, label: l, score: s } = res.data;
        setValue(typeof v === "number" ? v : Number(v) || 50);
        setLabel(l ?? "—");
        setScore(s != null ? String(s) : "—");
      }
    } catch (error) {
      console.error("Failed to fetch sentiment data:", error);
    }
  }, []);

  useEffect(() => {
    fetchSentiment();
    const interval = setInterval(fetchSentiment, SENTIMENT_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSentiment]);

  useEffect(() => {
    if (needleRef.current) {
      const angle =
        MIN_NEEDLE_ANGLE +
        (value / 100) * (MAX_NEEDLE_ANGLE - MIN_NEEDLE_ANGLE);
      needleRef.current.style.transform = `translateY(25%) rotate(${angle}deg)`;
    }
  }, [value]);

  return (
    <div className="w-full h-full">
      <div className="p-2 overflow-hidden h-full flex flex-col relative">
        <div className="flex flex-col h-full items-center justify-center">
          <div className="relative w-full aspect-2/1 max-w-[360px] md:max-h-[calc(50%+60px)]">
            <Image
              src={ellipseSvg}
              alt=""
              fill
              className="absolute inset-0 w-full h-full object-contain"
            />

            <div
              ref={needleRef}
              className="absolute bottom-0 left-0 right-0 mx-auto w-[60%] translate-y-[25%] transition-transform duration-1000 ease-in-out"
            >
              <Image
                src={needleSvg}
                alt=""
                width={200}
                height={200}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between translate-y-[120%]">
              <Typography
                variant="Span1216"
                className="text-quaternary-white font-bold"
              >
                Bearish
              </Typography>
              <Typography
                variant="Span1216"
                className="text-quaternary-white font-bold"
              >
                Bullish
              </Typography>
            </div>

            {/* Display the Score and Label from the Mocked API */}
            {/* <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center translate-y-[180%]">
              <Typography variant="h3" className="text-tertiary-green mb-1">
                {label}
              </Typography>
              <Typography variant="Span1216" className="text-secondary-white">
                Score: {score}
              </Typography>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
