'use client';

import React, {
  useMemo,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import Square from "./Square";
import HeatmapBuilder from "./HeatmapBuilder";
import { BiSolidDownArrow } from "react-icons/bi";

export default function Group({ group, onClick, onSquareHover }) {
  const { category, rect, data } = group;
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // Measure div size after render
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) {
      const { width, height } = el.getBoundingClientRect();
      setDimensions({ w: width, h: height });
    }
  }, [rect.x, rect.y, rect.w, rect.h]);

  // Build inner heatmap using actual div size
  const processedData = useMemo(() => {
    if (dimensions.w === 0 || dimensions.h === 0) return [];
    const cloned = data.map((d) => ({ ...d }));

    HeatmapBuilder.CreateHeatmap(
      cloned,
      Math.max(dimensions.w, 0),
      Math.max(dimensions.h, 0),
      "volume",
    );

    return cloned;
  }, [data, dimensions.w, dimensions.h]);

  return (
    <div
      onClick={onClick}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
      }}
      className="absolute overflow-hidden cursor-pointer"
    >
      <div className="h-full relative flex flex-col border border-[#ffffff] bg-[#000000] text-[#ffffff] hover:bg-cus_blue_color hover:text-light_white_color duration-700 group">
        <div className="w-full truncate pr-1 pl-1">{category}</div>
        <BiSolidDownArrow className="absolute top-4 left-0 z-10 text-[#000000] group-hover:text-cus_blue_color duration-700" />

        <div className="grow">
          <div
            ref={containerRef}
            className="relative h-full w-full overflow-hidden"
          >
            {processedData.map((item) => (
              <Square key={item.id} data={item} onSquareHover={onSquareHover} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
