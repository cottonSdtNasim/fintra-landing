'use client';

// Heatmap.jsx
import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Group from "./Group";
import HeatmapBuilder from "./HeatmapBuilder";
import { GetHeatmapColor } from "./HeatmapColors";
// import DemoData from "../../../data/demo-data.json"
import {
  BiSolidLeftArrow,
  BiSolidRightArrow,
  BiSolidUpArrow,
  BiSolidDownArrow,
} from "react-icons/bi";
// import { marketAnalysisApi } from "../../../api/marketAnalysis/marketAnalysis";
import { hitmapApi } from "../../../../api/hitmapApi";

import {
  prepareStockData,
  buildCategoryGroups,
} from "./HeatmapData";

const RESIZE_DEBOUNCE = 150;
const UPDATE_INTERVAL = 30 * 1000; // 30 seconds

export default function Heatmap() {
  // const [data, setData] = useState([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selectedGroup, setSelectedGroup] = useState(null);

  const heatmapRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  const [latestSnapshot, setLatestSnapshot] = useState([]);

  const reFetch = useCallback(async () => {
    // const result = await marketAnalysisApi.getLatestSnapshot();
    const result = await hitmapApi.getHitmapData();

    if (result && result.status) {
      setLatestSnapshot(result.data);
    }
  }, []);

  useEffect(() => {
    // fetch immediately once
    reFetch();

    const interval = setInterval(() => {
      reFetch();
    }, UPDATE_INTERVAL); // 2 minutes

    return () => clearInterval(interval);
  }, [reFetch]);

  // {
  //   "INSTRUMENT_CODE": "1JANATAMF",
  //   "OPEN_PRICE": "3.00",
  //   "HIGH_PRICE": "3.00",
  //   "LOW_PRICE": "2.70",
  //   "CLOSE_PRICE": "0.00",
  //   "YDAY_CLOSE_PRICE": "3",
  //   "LAST_TRADED_PRICE": "2.80",
  //   "TOTAL_TRADES": 71,
  //   "TOTAL_VOLUME": 567664,
  //   "TOTAL_VALUE": "1.587000",
  //   "LM_DATE_TIME": "2026-03-03T06:16:30.000000Z",
  //   "CHANGE_PCT_YDAY_CLOSE": 0,
  //   "SECTOR": "Mutual Funds",
  //   "STORED_AT": "2026-03-03 12:16:37"
  // },
  // Convert Snapshot to Usable Data
  const data = useMemo(() => {
    return latestSnapshot.map((s) => ({
      stock: s.INSTRUMENT_CODE,
      category: s.SECTOR,
      trades: s.TOTAL_TRADES,
      value: s.TOTAL_VALUE,
      volume: s.TOTAL_VOLUME,
      sign: s.CHANGE_PCT_YDAY_CLOSE < 0 ? -1 : 1,
      change: s.CHANGE_PCT_YDAY_CLOSE,
      ltp: s.LAST_TRADED_PRICE,
    }));
  }, [latestSnapshot]);

  // Measure div size after render
  useLayoutEffect(() => {
    const el = heatmapRef.current;
    if (el) {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: width, h: height });
    }
  }, []);

  // Resize listener (debounced)
  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        const el = heatmapRef.current;
        if (el) {
          const { width, height } = el.getBoundingClientRect();
          setSize({ w: width, h: height });
        }
      }, RESIZE_DEBOUNCE);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  // const reFetch = useCallback(async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/stocks");

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch stocks");
  //     }

  //     const result = await response.json();

  //     // Response structure: { success: true, count: X, data: [...] }
  //     setData(result.data);
  //   } catch (error) {
  //     console.error("Error loading stocks:", error);

  //     // Fallback to demo data on error
  //     setData(DemoData);
  //   }
  // }, []);

  const groups = useMemo(() => {
    if (size.w === 0 || size.h === 0 || data.length === 0) return [];

    const prepared = prepareStockData(data);
    const categoryGroups = buildCategoryGroups(prepared);

    HeatmapBuilder.CreateHeatmap(
      categoryGroups,
      size.w,
      size.h,
      "total_volume",
    );

    const updatedGroups = categoryGroups.map((group) => {
      if (selectedGroup === null) {
        return { ...group };
      } else if (selectedGroup === group.category) {
        return { ...group, rect: { x: 0, y: 0, w: size.w, h: size.h } };
      } else {
        return { ...group, rect: { x: 0, y: 0, w: 0, h: 0 } };
      }
    });

    return updatedGroups;
  }, [data, size.w, size.h, selectedGroup]);

  const tooltipRef = useRef(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [tooltipPlacement, setTooltipPlacement] = useState("right"); // arrow side: left | right
  // const [tooltipPlacementY, setTooltipPlacementY] = useState("top"); // arrow side: top | bottom

  const MOUSE_W = 5;
  const TOOLTIP_OFFSET = 15;
  const PADDING = 20;
  const R_WINDOW_AVOID = 200;

  const handleMouseMove = useCallback((e) => {
    const el = tooltipRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = e.clientX + TOOLTIP_OFFSET + MOUSE_W;
    let top = e.clientY - PADDING;

    if (left + rect.width + TOOLTIP_OFFSET > vw - R_WINDOW_AVOID)
      left = e.clientX - rect.width - TOOLTIP_OFFSET;
    if (left < TOOLTIP_OFFSET) left = e.clientX + TOOLTIP_OFFSET + MOUSE_W;

    if (top + rect.height + PADDING > vh)
      top = e.clientY - rect.height + PADDING;
    if (top < PADDING) top = e.clientY - PADDING;

    el.style.left = left + "px";
    el.style.top = top + "px";

    const dLeft = Math.abs(left - e.clientX);
    const dRight = Math.abs(left + rect.width - e.clientX);

    // const min = Math.min(dLeft, dRight, dTop, dBottom);
    // const placement = min === dLeft ? "left" : min === dRight ? "right" : min === dTop ? "top" : "bottom";
    const minX = Math.min(dLeft, dRight);
    setTooltipPlacement(minX === dLeft ? "left" : "right");

    // const dTop = Math.abs(top - e.clientY);
    // const dBottom = Math.abs(top + rect.height - e.clientY);
    // const minY = Math.min(dTop, dBottom);
    // setTooltipPlacementY(minY === dTop ? "top" : "bottom");
  }, []);

  const handleSquareHover = useCallback(
    (data) => {
      setHoveredData((prev) => {
        // prevent unnecessary state updates
        if (prev?.stock === data?.stock) return prev;
        return data;
      });
    },
    [data],
  );

  const priceText = hoveredData
    ? (hoveredData.change > 0 ? "+" : "") + hoveredData.change + "%"
    : "";
  const hoverColors = hoveredData ? GetHeatmapColor(hoveredData.change) : null;

  return (
    <div
      ref={heatmapRef}
      onMouseMove={handleMouseMove}
      className="absolute top-0 left-0 h-full w-full overflow-hidden font-mono"
    >
      {groups.map((group) => (
        <Group
          key={group.category}
          group={group}
          onSquareHover={handleSquareHover}
          onClick={() =>
            setSelectedGroup(
              selectedGroup === group.category ? null : group.category,
            )
          }
        />
      ))}

      {/* Hover Info */}
      {hoveredData && (
        <>
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              left: "-100%",
              top: "-100%",
            }}
            className="pointer-events-none z-50 w-75 rounded-[10px] border-0  bg-[#000000] p-1.5 text-[#ffffff] text-[12px] relative "
          >
            {tooltipPlacement === "left" && (
              <BiSolidLeftArrow className="text-[#000000] absolute top-1/2 -left-2 -translate-y-1/2 z-50" />
            )}
            {tooltipPlacement === "right" && (
              <BiSolidRightArrow className="text-[#000000] absolute top-1/2 -right-2 -translate-y-1/2 z-50" />
            )}
            {/* {tooltipPlacement === "top" && (
              <BiSolidUpArrow className="text-[#000000] absolute left-1/2 -top-2 -translate-x-1/2 z-50" />
            )}
            {tooltipPlacement === "bottom" && (
              <BiSolidDownArrow className="text-[#000000] absolute left-1/2 -bottom-2 -translate-x-1/2 z-50" />
            )} */}

            <div className="flex items-center">
              <div className="px-2.5 pl-1 leading-13.5 font-bold text-2xl">
                <span>
                  {/* {style = {{color: hoverColors?.text }} } */}
                  {hoveredData.abbr}
                </span>
              </div>

              <div>
                <p>Name: {hoveredData.stock}</p>
                <p>Total Trades: {hoveredData.trades} </p>
                <p>Total Volume: {(hoveredData.volume / 1_00_00_000).toFixed(2)} CR</p>
                <p>Total Value: {Number(hoveredData.value).toFixed(2)}</p>
                {/* <p>
                  Price Change:
                  <span
                    className={
                        hoveredData.change > 0 ? "text-light_green_color_pos" :
                        hoveredData.change < 0 ? "text-light_red_color_neg" : "text-light_gray_text_color"
                    }
                  >
                    {" "}
                    {priceText}
                  </span>
                </p> */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
