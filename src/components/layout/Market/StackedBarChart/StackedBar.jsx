import React, { useMemo, useState } from "react";
import { Typography } from "../../../common/Typography";
import Tooltip from "../../../common/Tooltip";

/**
 * StackedBar Component
 *
 * Renders a stacked bar chart using the provided header and data.
 *
 * @param {Object} props
 * @param {Object} props.header - Defines the chart header and series labels
 * @param {string} props.header.label - The main label for the chart (e.g., "Sector")
 * @param {Array<{ text: string, color: string }>} props.header.values - Array of series definitions with label text and color
 * @param {Array<{ label: string, values: number[] }>} props.data - Array of chart rows where each row contains:
 *    - label: row/category name (e.g., "Technology")
 *    - values: array of numeric values corresponding to the header series
 *
 * @component
 */

export default function StackedBar({ header, data }) {
  if (!header || !data) return null;

  const colors = header.values.map((item) => item.color);
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-[minmax(0,auto)_1fr] items-center">
        {/* Header Label */}
        <div className="py-1">
          <Typography
            variant="text14"
            className="text-light_black_color font-medium shrink-0"
          >
            {header.label}
          </Typography>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-2 gap-y-2 min-w-0">
          {header.values.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredColorIndex(index)}
              onMouseLeave={() => setHoveredColorIndex(null)}
              className="flex items-center gap-1 shrink-0  transition-all duration-300 ease-out"
              style={{
                transform:
                  hoveredColorIndex === index ? "scale(1.1)" : "scale(1)",
                opacity:
                  hoveredColorIndex === null
                    ? 1
                    : hoveredColorIndex === index
                      ? 1
                      : 0.4,
              }}
            >
              <div
                style={{ backgroundColor: item.color }}
                className="w-2 h-2 rounded-full shrink-0 ring-1 ring-white/50"
              />
              <Typography
                variant="text12"
                className="text-light_gray_text_color whitespace-nowrap cursor-default"
              >
                {item.text}
              </Typography>
            </div>
          ))}
        </div>

        {/* Rows */}
        {data.map((row, index) => (
          <div
            key={row.label}
            onMouseEnter={() => setHoveredRowIndex(index)}
            onMouseLeave={() => setHoveredRowIndex(null)}
            className="contents transition-all duration-300"
          >
            <div className="py-1">
              <Tooltip content={row.label} placement="bottom">
                <Typography
                  variant="text14"
                  className="text-(--primary-white) pr-2 shrink-0 transition-color duration-300 cursor-default"
                  style={{
                    opacity:
                      hoveredRowIndex === null
                        ? 1
                        : hoveredRowIndex === index
                          ? 1
                          : 0.4,
                  }}
                >
                  {row.label.length > 10
                    ? `${row.label.substring(0, 15)}...`
                    : row.label}
                </Typography>
              </Tooltip>
            </div>

            <div className="py-1 w-full min-w-0 h-full min-h-[20px] rounded-lg transition-color duration-300 overflow-visible">
              <StackedBarRow
                values={row.values}
                colors={colors}
                isRowHovered={index === hoveredRowIndex}
                hoveredColorIndex={hoveredColorIndex}
                setHoveredColorIndex={setHoveredColorIndex}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackedBarRow({
  values,
  colors,
  isRowHovered,
  hoveredColorIndex,
  setHoveredColorIndex,
}) {
  if (values.length !== colors.length)
    throw new Error("Values and colors arrays must have the same length");

  const proportions = useMemo(() => {
    const total = values.reduce((sum, val) => sum + val, 0);
    return values.map((val) => (total > 0 ? val / total : 0));
  }, [values]);

  return (
    <div className="w-full h-full flex flex-row items-stretch rounded-sm overflow-visible relative">
      {proportions.map((proportion, colorIndex) => (
        <div
          key={colorIndex}
          onMouseEnter={() => setHoveredColorIndex(colorIndex)}
          onMouseLeave={() => setHoveredColorIndex(null)}
          className="transition-opacity duration-300 ease-out first:rounded-l-sm last:rounded-r-sm min-w-0 h-[calc(100%-0.5rem)] my-auto overflow-visible"
          style={{
            width: `${proportion * 100}%`,
            // height: `${proportion * 50}%`,
            backgroundColor: colors[colorIndex],
            border:
              hoveredColorIndex === colorIndex ? "solid 1px gray" : "none",
            opacity:
              hoveredColorIndex === null
                ? 1
                : hoveredColorIndex === colorIndex
                  ? 1
                  : 0.2,
          }}
        >
          {hoveredColorIndex === colorIndex && isRowHovered && (
            <div
              style={{
                transform: "translate(-110%, -3px)",
              }}
              className="absolute left-0 z-20 leading-line-height-22 w-7 h-7 bg-(--secondary-black) pointer-events-none rounded-sm border border-light_border_color flex items-center justify-center"
            >
              <Typography>{values[colorIndex]}</Typography>
            </div>
          )}
        </div>
      ))}

      {hoveredColorIndex === null && isRowHovered && (
        <div
          style={{
            transform: "translate(-110%, -3px)",
          }}
          className="absolute left-0 z-20 leading-line-height-22 w-7 h-7 bg-(--secondary-black) pointer-events-none rounded-sm border border-light_border_color flex items-center justify-center"
        >
          <Typography>{values.reduce((acc, val) => acc + val, 0)}</Typography>
        </div>
      )}
    </div>
  );
}
