import { useState, useRef, useEffect } from "react";

function getTextWidth(text, font = "12px sans-serif") {
  if (typeof document === "undefined") return text.length * 7;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  return ctx.measureText(text).width;
}

function getTextHeight(text, font = "12px sans-serif") {
  if (typeof document === "undefined") return 14;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  return (
    ctx.measureText(text).actualBoundingBoxAscent +
    ctx.measureText(text).actualBoundingBoxDescent
  );
}

export default function BarChart({
  metric = [],
  data = [],
  valueFormat = null,
  padding = 0,
  barAreaRatio = 0.9,
  barGapRatio = 0.1,
  gridLineColor = "#222F2F",
  gridLineDash = "2,2",
  zeroLineColor = "#222F2F",
  labelColor = "#EAEBF4",
  metricColor = "#EAEBF4",
  colorPalette,
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

  if (!width || !height || data.length === 0) {
    return <svg ref={svgRef} className="w-full h-full" />;
  }

  // metric texts
  const metricTexts = metric.map((m) =>
    valueFormat ? valueFormat(m) : m.toLocaleString(),
  );

  const maxMetricWidth = Math.max(
    ...metricTexts.map((t) => getTextWidth(t)),
    0,
  );
  const leftPadding = Math.max(padding, maxMetricWidth + 15);
  const rightPadding = padding;

  // dynamic bottom padding from labels
  const labelFont = "12px sans-serif";
  const maxLabelHeight = Math.max(
    ...data.map((g) => getTextHeight(g.label, labelFont)),
    0,
  );
  const bottomPadding = Math.max(padding, maxLabelHeight + 5);

  // values and y-axis
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

  // horizontal groups
  const availableWidth = width - leftPadding - rightPadding;
  const groupCount = data.length;
  const groupContentWidth = availableWidth / groupCount;
  const maxBarsInGroup = Math.max(...data.map((g) => g.bars.length), 1);

  const groupXPadding = groupContentWidth * 0.1;
  const barAreaWidth = (groupContentWidth - groupXPadding * 2) * barAreaRatio;
  const barWidth = barAreaWidth / maxBarsInGroup;
  const barGap =
    maxBarsInGroup > 1
      ? (barAreaWidth * barGapRatio) / (maxBarsInGroup - 1)
      : 0;

  const totalBarsWidth = maxBarsInGroup * barWidth;
  const totalInnerGaps = (maxBarsInGroup - 1) * barGap;
  const clusterWidth = totalBarsWidth + totalInnerGaps;

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
          <g key={`metric-${i}`}>
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
        const groupX = leftPadding + gi * groupContentWidth;
        const lineX = groupX + groupContentWidth;
        return (
          <line
            key={`vline-${gi}`}
            x1={lineX}
            x2={lineX}
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

      {/* bars */}
      {data.map((group, gi) => {
        const groupX = leftPadding + gi * groupContentWidth;
        const clusterStartX =
          groupX +
          groupXPadding +
          (groupContentWidth - groupXPadding * 2 - clusterWidth) / 2;
        const labelX = groupX + groupContentWidth / 2;

        return (
          <g key={`group-${gi}`}>
            {group.bars.map((bar, bi) => {
              const yTop = scaleY(Math.max(bar.value, 0));
              const yBottom = scaleY(Math.min(bar.value, 0));
              const barHeight = yBottom - yTop;
              const x = clusterStartX + bi * (barWidth + barGap);
              const barColor =
                bar.color || colorPalette[bi % colorPalette.length];
              const isHovered = hovered?.gi === gi && hovered?.bi === bi;

              return (
                <g key={`bar-${gi}-${bi}`}>
                  <rect
                    x={x}
                    y={yTop}
                    width={barWidth}
                    height={barHeight}
                    fill={barColor}
                    rx="2"
                    opacity={isHovered ? 1 : 0.85}
                    stroke={isHovered ? "#000" : "none"}
                    strokeWidth="1"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() =>
                      setHovered({
                        gi,
                        bi,
                        x: x + barWidth / 2,
                        y: yTop,
                        value: bar.value,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              );
            })}

            <g
              transform={`translate(${labelX}, ${height - bottomPadding / 2}) rotate(-60)`}
            >
              <text
                x={0}
                y={0}
                fontSize="12"
                textAnchor="middle"
                fill={labelColor}
                fontWeight="500"
                dominantBaseline="middle"
              >
                {group.label}
              </text>
            </g>
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
