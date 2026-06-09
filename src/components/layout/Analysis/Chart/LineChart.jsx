import { useState, useRef, useEffect } from "react";

let canvas, ctx;

function getCtx() {
  if (typeof document === "undefined") return null;
  if (!canvas) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
  }
  return ctx;
}

function getTextWidth(text, font = "12px sans-serif") {
  const context = getCtx();
  if (!context) return text.length * 7;
  context.font = font;
  return context.measureText(text).width;
}

function getTextHeight(text, font = "12px sans-serif") {
  const context = getCtx();
  if (!context) return 14;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

export default function LineChart({
  metric = [],
  data = [],
  valueFormat = null,
  padding = 0,
  innerPadding = 20,
  gridLineColor = "#222F2F",
  gridLineDash = "2,2",
  zeroLineColor = "#222F2F",
  labelColor = "#EAEBF4",
  metricColor = "#EAEBF4",
  pointRadius = 4,
  lineWidth = 2,
  colorPalette,
  stepType = null, // "end" | "middle"
}) {
  const svgRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  if (!width || !height || data.length === 0)
    return <svg ref={svgRef} className="w-full h-full" />;

  // Measure metric widths
  const metricTexts = metric.map((m) =>
    valueFormat ? valueFormat(m) : m.toLocaleString(),
  );
  const maxMetricWidth = Math.max(
    ...metricTexts.map((t) => getTextWidth(t)),
    0,
  );

  // Dynamic bottom padding from labels
  const labelFont = "12px sans-serif";
  const maxLabelHeight = Math.max(
    ...data.map((g) => getTextHeight(g.label || "", labelFont)),
    0,
  );
  const bottomPadding = Math.max(padding, maxLabelHeight + 5); // extra 5px for spacing

  // Measure label widths for left/right padding
  const labelWidths = data.map((g) => getTextWidth(g.label || "", labelFont));
  const maxLabelHalf = Math.max(...labelWidths.map((w) => w / 2), 0);

  const leftPadding = Math.max(padding, maxMetricWidth + 15, maxLabelHalf);
  const rightPadding = Math.max(padding, maxLabelHalf);

  // Compute Y scale
  const values = data.flatMap((d) => d.bars.map((b) => b.value));
  const allNumbers = [...values, ...metric];
  let minValue = Math.min(...allNumbers);
  let maxValue = Math.max(...allNumbers);
  if (minValue === Infinity || maxValue === -Infinity) {
    minValue = 0;
    maxValue = 10000;
  }

  const yPaddingRatio = 0.05;
  const range = maxValue - minValue || 1;
  const paddedMin = minValue - range * yPaddingRatio;
  const paddedMax = maxValue + range * yPaddingRatio;
  const chartHeight = height - padding - bottomPadding;

  const scaleY = (value) =>
    padding +
    chartHeight -
    ((value - paddedMin) / (paddedMax - paddedMin)) * chartHeight;
  const zeroY =
    minValue < 0 && maxValue > 0
      ? scaleY(0)
      : minValue >= 0
        ? scaleY(minValue)
        : scaleY(maxValue);

  // Horizontal scale
  const availableWidth = width - leftPadding - rightPadding;
  const groupCount = data.length;
  const chartWidth = availableWidth - innerPadding * 2;
  const stepX = groupCount > 1 ? chartWidth / (groupCount - 1) : 0;

  // Series
  const maxBarsInGroup = Math.max(...data.map((g) => g.bars.length), 1);
  const series = Array.from({ length: maxBarsInGroup }, (_, bi) =>
    data.map((g, gi) => {
      const bar = g.bars[bi];
      return {
        x: leftPadding + innerPadding + gi * stepX,
        y: scaleY(bar?.value ?? 0),
        value: bar?.value ?? 0,
        color: bar?.color || colorPalette[bi % colorPalette.length],
        gi,
        bi,
      };
    }),
  );

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      {/* metric lines */}
      {metric.map((m, i) => {
        const y = scaleY(m);
        return (
          <g key={i}>
            <line
              x1={leftPadding}
              x2={width - rightPadding}
              y1={y}
              y2={y}
              stroke={gridLineColor}
              strokeWidth="1"
              strokeDasharray={gridLineDash}
            />
            <text
              x={leftPadding - 10}
              y={y}
              fontSize="12"
              textAnchor="end"
              alignmentBaseline="middle"
              fill={metricColor}
            >
              {valueFormat ? valueFormat(m) : m.toLocaleString()}
            </text>
          </g>
        );
      })}

      {/* vertical grid */}
      {data.map((_, gi) => {
        const x = leftPadding + innerPadding + gi * stepX;
        return (
          <line
            key={gi}
            x1={x}
            x2={x}
            y1={padding}
            y2={height - bottomPadding}
            stroke={gridLineColor}
            strokeWidth="1"
            strokeDasharray={gridLineDash}
          />
        );
      })}

      {/* zero axis */}
      {zeroY >= 0 && zeroY <= height && (
        <line
          x1={leftPadding}
          x2={width - rightPadding}
          y1={zeroY}
          y2={zeroY}
          stroke={zeroLineColor}
          strokeWidth="1.5"
        />
      )}

      {/* lines + points */}
      {series.map((points, si) => {
        const color = points[0].color;

        const path = points.reduce((acc, p, i) => {
          if (i === 0) {
            return `M ${p.x} ${p.y}`;
          }

          const prev = points[i - 1];

          if (stepType === "middle") {
            const midX = (prev.x + p.x) / 2;

            return (
              acc +
              ` L ${midX} ${prev.y}` + // horizontal to midpoint
              ` L ${midX} ${p.y}` + // vertical jump
              ` L ${p.x} ${p.y}`
            ); // horizontal to next point
          }

          if (stepType === "end") {
            return acc + ` L ${p.x} ${prev.y}` + ` L ${p.x} ${p.y}`;
          }

          // default straight line
          return acc + ` L ${p.x} ${p.y}`;
        }, "");

        return (
          <g key={si}>
            <path d={path} fill="none" stroke={color} strokeWidth={lineWidth} />
            {points.map((p, i) => {
              const isHovered = hovered?.gi === p.gi && hovered?.bi === p.bi;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? pointRadius + 2 : pointRadius}
                  fill={color}
                  stroke={isHovered ? "#000" : "white"}
                  strokeWidth="1.5"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered({ ...p })}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </g>
        );
      })}

      {/* bottom labels */}
      {data.map((g, gi) => {
        const x = leftPadding + innerPadding + gi * stepX;
        return (
          <g
            key={gi}
            transform={`translate(${x}, ${height - bottomPadding / 2}) rotate(-60)`}
          >
            <text
              x={0}
              y={0}
              fontSize="12"
              textAnchor="middle"
              fill={labelColor}
              fontWeight="500"
            >
              {g.label}
            </text>
          </g>
        );
      })}

      {/* tooltip */}
      {hovered && (
        <g pointerEvents="none">
          <rect
            x={hovered.x - 40}
            y={hovered.y - 35}
            width="80"
            height="20"
            rx="4"
            fill="#333"
          />
          <text
            x={hovered.x}
            y={hovered.y - 21}
            fill="#fff"
            fontSize="11"
            textAnchor="middle"
          >
            {valueFormat
              ? valueFormat(hovered.value)
              : hovered.value.toLocaleString()}
          </text>
        </g>
      )}
    </svg>
  );
}
