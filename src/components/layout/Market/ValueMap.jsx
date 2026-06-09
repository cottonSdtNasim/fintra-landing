"use client";

import React, { useRef, useState, useEffect } from "react";
// import Tooltip from "../../shared/Tooltip";
// import { GoQuestion } from "react-icons/go";
import Heatmap from "./HeatMap/Heatmap";
import {
  HeatmapColors,
  HeatmapTextColors,
  HeatmapBreakpoints,
} from "./HeatMap/HeatmapColors";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { Typography } from "../../common/Typography";

export default function ValueMap() {
  const fullScreenContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullScreenContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="grow">
      <div
        ref={fullScreenContainerRef}
        className="w-full h-full flex flex-col "
      >
        <div className="flex items-center gap-2 grow-0 justify-end">
          {/* <h1 className="text-2xl grow">Heatmap</h1> */}

          {/* Indicators */}
          <div className="gap-2 flex monospace text-lg p-2">
            <Typography>Indicators</Typography>
            {HeatmapColors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 flex items-center justify-center p-2 rounded-md"
                style={{ backgroundColor: color }}
              >
                <Typography
                  key={index}
                  style={{ color: HeatmapTextColors[index] }}
                >
                  {HeatmapBreakpoints[index] >= 0
                    ? `+${HeatmapBreakpoints[index]}`
                    : HeatmapBreakpoints[index]}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        <div className="grow w-full relative">
          <div className="absolute top-1 right-1 z-10">
            <button
              onClick={() => {
                toggleFullscreen();
              }}
              className=" bg-[#ffffff] px-1 py-1 rounded-md text-[#000000]  hover:bg-[#ffffffdd]"
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-6 h-6" />
              ) : (
                <FiMaximize2 className="w-6 h-6" />
              )}
            </button>
          </div>
          <div className="w-full h-full overflow-auto min-h-0 min-w-0">
            <div className="h-full min-h-125 min-w-150">
              <Heatmap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
