'use client';

import { GetHeatmapColor } from "./HeatmapColors";

export default function Square({ data, onSquareHover }) {
  const medium =
    (data.rect.w < 140 && data.rect.w >= 80) ||
    (data.rect.h < 100 && data.rect.h >= 60);
  const small =
    (data.rect.w < 80 && data.rect.w >= 40) ||
    (data.rect.h < 60 && data.rect.h >= 40);
  const tiny =
    (data.rect.w < 40 && data.rect.w >= 20) ||
    (data.rect.h < 40 && data.rect.h >= 20);
  const hidden = data.rect.w < 25 || data.rect.h < 20;

  const priceText = (data.change > 0 ? "+" : "") + data.change + "%";

  const { bg, text } = GetHeatmapColor(data.change);

  return (
    <div
      style={{
        position: "absolute",
        left: data.rect.x,
        top: data.rect.y,
        width: data.rect.w,
        height: data.rect.h,
      }}
      onMouseEnter={() => onSquareHover(data)}
      onMouseLeave={() => onSquareHover(null)}
      className="group font-bold transition-all duration-500 ease-in-out select-none"
    >
      <div
        style={{ backgroundColor: bg, color: text }}
        className="flex h-full w-full items-center justify-center border border-gray-800 hover:border-white"
      >
        {!hidden &&
          ((tiny && (
            // Small
            <div className="text-center">
              <div className="text-[12px]">{data.abbr}</div>
            </div>
          )) ||
            (!tiny &&
              ((small && (
                // Small
                <div className="text-center">
                  <div className="text-[16px]">{data.abbr}</div>
                  <div className="text-[10px]">{priceText}</div>
                </div>
              )) ||
                (!small &&
                  ((medium && (
                    // Medium
                    <div className="text-center">
                      <div className="text-[25px]">{data.abbr}</div>
                      <div className="text-[18px]">{priceText}</div>
                    </div>
                  )) ||
                    (!medium && (
                      // Large
                      <div className="text-center">
                        <div className="text-[32px]">{data.abbr}</div>
                        <div className="text-[25px]">{priceText}</div>
                      </div>
                    )))))))}
      </div>
    </div>
  );
}
