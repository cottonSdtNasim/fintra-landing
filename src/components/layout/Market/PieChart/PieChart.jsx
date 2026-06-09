import { useMemo, useState } from "react";
import { Typography } from "../../../common/Typography";

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `
    M ${cx} ${cy}
    L ${start.x} ${start.y}
    A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    Z
  `;
}

export default function PieChart({ data }) {
  const arcs = useMemo(() => {
    const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
    if (total <= 0) return [];

    let currentAngle = 0;

    return data.map((slice) => {
      const sliceAngle = (slice.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      const path = describeArc(50, 50, 50, startAngle, endAngle);

      currentAngle = endAngle;

      return {
        ...slice,
        path,
      };
    });
  }, [data]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="h-full min-h-0 flex flex-col items-center justify-center gap-3 py-1">
      {/* PIE */}
      <div className="relative w-full max-w-[160px] md:max-w-[200px] aspect-square min-h-[120px] shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {arcs.map((slice, index) => (
            <path
              key={slice.label}
              d={slice.path}
              fill={slice.color}
              strokeWidth={0.5}
              stroke={"#FFFFFF"}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-default transition-all duration-300 ease-out"
              style={{
                transformOrigin: "50% 50%",
                transformBox: "view-box",
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                opacity:
                  hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.4,
              }}
            />
          ))}
        </svg>

        {data && hoveredIndex !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-(--secondary-black) border border-(--primary-white) w-20 h-20 rounded-full flex items-center justify-center">
              <Typography>{data[hoveredIndex].value}</Typography>
            </div>
          </div>
        )}
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 shrink-0">
        {data.map((item, index) => (
          <div
            key={item.label}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`flex items-center gap-1.5 shrink-0 cursor-default transition-opacity duration-300`}
            style={{
              transformOrigin: "50% 50%",
              transform: hoveredIndex === index ? "scale(1.2)" : "scale(1)",

              opacity:
                hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.4,
            }}
          >
            <div
              style={{ backgroundColor: item.color }}
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/50 dark:ring-white/30"
            />
            <Typography
              variant="p"
              className="text-light_gray_text_color whitespace-nowrap"
            >
              {item.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
