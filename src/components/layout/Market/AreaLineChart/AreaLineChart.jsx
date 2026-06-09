import { useState, useRef, useEffect } from "react";

const getCanvasContext = () => {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  return canvas.getContext("2d");
};

const ctx = getCanvasContext();

function getTextWidth(text, font = "12px sans-serif") {
  if (!ctx) return text.length * 6; // SSR fallback estimate
  ctx.font = font;
  return ctx.measureText(text).width;
}

function getTextHeight(text, font = "12px sans-serif") {
  if (!ctx) return 14; // SSR fallback estimate
  ctx.font = font;
  const metrics = ctx.measureText(text);
  return (
    (metrics.actualBoundingBoxAscent || 10) +
    (metrics.actualBoundingBoxDescent || 4)
  );
}

/** e.g. "2026-05-03 11:29:45" or ISO with T → date and time on separate tooltip lines. */
function splitTooltipDateTime(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return { date: "—", time: null };
  const normalized = s.replace("T", " ");
  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return { date: parts[0], time: parts.slice(1).join(" ") };
  }
  return { date: s, time: null };
}

/**
 * Parse a time string (HH:MM, HH:MM:SS, or datetime containing a time part)
 * into total seconds since midnight. Returns null if unparseable.
 */
function parseTimeToSeconds(str) {
  if (!str) return null;
  const clean = String(str).trim().replace("T", " ");
  const timePart =
    clean.split(/\s+/).find((p) => /^\d{1,2}:\d{2}(:\d{2})?$/.test(p)) ?? clean;
  const m = timePart.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  return (
    parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + (m[3] ? parseInt(m[3]) : 0)
  );
}

/** Format seconds-since-midnight → "HH:MM" */
function secondsToTimeLabel(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function AreaLineChart({
  metric = [],
  data = [],
  valueFormat = null,
  padding = 0,
  innerPadding = 20,
  gridLineColor = "var(--tertiary-black)",
  gridLineDash = "4,4",
  zeroLineColor = "var(--tertiary-black)",
  labelColor = "var(--tertiary-black)",
  metricColor = "var(--tertiary-black)",
  pointRadius = 4,
  lineWidth = 2,
  colorPalette,
  stepType = null, // "end" | "middle"
  intervalType = "step", // "step" | "time"
  interval = 1, // step count (step mode) | seconds between ticks (time mode)
  intervalStart = null, // time string anchor, e.g. "10:05"
  minWidth = 600, // minimum width to enable horizontal scrolling
}) {
  const svgRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState(null);
  const prevHoveredRef = useRef(null); // last known hovered point (for position-when-hiding)
  const hasHoveredRef = useRef(false); // becomes true after first hover ever

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
    return (
      // responsive
      <div className="w-full h-full overflow-x-auto no-scrollbar">
        <div style={{ minWidth: `${minWidth}px`, height: "100%" }}>
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </div>
    );

  // ── Padding / sizing ──────────────────────────────────────────────────────
  const metricTexts = metric.map((m) =>
    valueFormat ? valueFormat(m) : m.toLocaleString(),
  );
  const maxMetricWidth = Math.max(
    ...metricTexts.map((t) => getTextWidth(t)),
    0,
  );
  const labelFont = "12px sans-serif";
  const maxLabelHeight = Math.max(
    ...data.map((g) => getTextHeight(g.label || "", labelFont)),
    0,
  );
  const bottomPadding = Math.max(padding, maxLabelHeight + 5);
  const leftPadding = Math.max(padding, maxMetricWidth + 15);
  const rightPadding = Math.max(padding, 10);

  const chartLeft = leftPadding + innerPadding;
  const chartRight = width - rightPadding - innerPadding;
  const chartWidth = chartRight - chartLeft;

  // ── Y scale ───────────────────────────────────────────────────────────────
  const values = data.flatMap((d) => d.bars.map((b) => b.value));
  const allNumbers = [...values, ...metric];
  let minValue = Math.min(...allNumbers);
  let maxValue = Math.max(...allNumbers);
  if (minValue === Infinity || maxValue === -Infinity) {
    minValue = 0;
    maxValue = 10000;
  }

  const yPaddingRatio = 0.05;
  const yRange = maxValue - minValue || 1;
  const paddedMin = minValue - yRange * yPaddingRatio;
  const paddedMax = maxValue + yRange * yPaddingRatio;
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

  // ── Time mode: continuous X axis keyed by clock time ─────────────────────
  const isTimeMode = intervalType === "time";

  const dataSeconds = data.map((g) => parseTimeToSeconds(g.label));
  const validSeconds = dataSeconds.filter((s) => s !== null);
  const minTime = validSeconds.length ? Math.min(...validSeconds) : 0;
  const maxTime = validSeconds.length ? Math.max(...validSeconds) : 0;
  const timeSpan = maxTime - minTime || 1;

  /** Seconds → SVG x (time mode only) */
  const scaleXTime = (sec) =>
    chartLeft + ((sec - minTime) / timeSpan) * chartWidth;

  // ── Step mode X ───────────────────────────────────────────────────────────
  const stepX = data.length > 1 ? chartWidth / (data.length - 1) : 0;
  const scaleXStep = (gi) => chartLeft + gi * stepX;

  // ── Series ────────────────────────────────────────────────────────────────
  const palette = colorPalette?.length
    ? colorPalette
    : ["var(--tertiary-green)"];
  const maxBarsInGroup = Math.max(...data.map((g) => g.bars.length), 1);

  const series = Array.from({ length: maxBarsInGroup }, (_, bi) =>
    data
      .map((g, gi) => {
        const bar = g.bars[bi];
        const x = isTimeMode
          ? dataSeconds[gi] !== null
            ? scaleXTime(dataSeconds[gi])
            : null
          : scaleXStep(gi);
        return {
          x,
          y: scaleY(bar?.value ?? 0),
          value: bar?.value ?? 0,
          label: g.label || "",
          tooltipLabel: (g.tooltipLabel ?? g.label) || "",
          color: bar?.color || palette[bi % palette.length],
          gi,
          bi,
        };
      })
      .filter((p) => p.x !== null),
  );

  // ── Time-mode ticks ───────────────────────────────────────────────────────
  // Generate ticks independently of where data points land.
  // Anchor: intervalStart snapped to the first tick >= minTime.
  // If intervalStart is absent or unparseable, anchor at minTime.
  let timeTicks = [];
  if (isTimeMode && interval > 0) {
    let anchorSec = minTime; // default

    if (intervalStart != null) {
      const startSec = parseTimeToSeconds(intervalStart);
      if (startSec !== null) {
        // First tick from startSec that is >= minTime
        const k = Math.ceil((minTime - startSec) / interval);
        anchorSec = startSec + k * interval;
      }
    }

    for (let sec = anchorSec; sec <= maxTime; sec += interval) {
      timeTicks.push({
        sec,
        x: scaleXTime(sec),
        label: secondsToTimeLabel(sec),
      });
    }
  }

  // ── Hover ─────────────────────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const allPoints = series.flat();
    if (!allPoints.length) return;
    const closest = allPoints.reduce((prev, curr) =>
      Math.abs(curr.x - mouseX) < Math.abs(prev.x - mouseX) ? curr : prev,
    );
    const wasHovered = hasHoveredRef.current;
    setHovered({ ...closest, _firstAppear: !wasHovered });
    prevHoveredRef.current = closest;
    hasHoveredRef.current = true;
  };

  const handleMouseLeave = () => setHovered(null);

  return (
    <div className="w-full h-full overflow-x-auto no-scrollbar">
      <div style={{ minWidth: `${minWidth}px`, height: "100%" }}>
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {series.map((points, si) => {
              const color = points[0]?.color;
              if (!color) return null;
              return (
                <linearGradient
                  key={si}
                  id={`gradient-${si}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              );
            })}
          </defs>

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

          {/* vertical grid lines */}
          {isTimeMode
            ? timeTicks.map((tick, i) => (
                <line
                  key={i}
                  x1={tick.x}
                  x2={tick.x}
                  y1={padding}
                  y2={height - bottomPadding}
                  stroke={gridLineColor}
                  strokeWidth="1"
                  strokeDasharray={gridLineDash}
                />
              ))
            : data.map((_, gi) => {
                const x = scaleXStep(gi);
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

          {/* lines + filled area */}
          {series.map((points, si) => {
            if (!points.length) return null;
            const color = points[0].color;

            const linePath = points.reduce((acc, p, i) => {
              if (i === 0) return `M ${p.x} ${p.y}`;
              const prev = points[i - 1];
              if (stepType === "middle") {
                const midX = (prev.x + p.x) / 2;
                return (
                  acc + ` L ${midX} ${prev.y} L ${midX} ${p.y} L ${p.x} ${p.y}`
                );
              }
              if (stepType === "end")
                return acc + ` L ${p.x} ${prev.y} L ${p.x} ${p.y}`;
              return acc + ` L ${p.x} ${p.y}`;
            }, "");

            const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - bottomPadding} L ${points[0].x} ${height - bottomPadding} Z`;

            return (
              <g key={si}>
                <path
                  d={areaPath}
                  fill={`url(#gradient-${si})`}
                  stroke="none"
                />
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth={lineWidth}
                />
                {points.map((p, i) => {
                  const isHov = hovered?.gi === p.gi && hovered?.bi === p.bi;
                  if (!isHov) return null;
                  return (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={pointRadius + 2}
                      fill={color}
                      stroke="var(--primary-black)"
                      strokeWidth="1.5"
                      style={{ pointerEvents: "none" }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* bottom labels */}
          {isTimeMode
            ? // Time mode: one label per generated tick, x-position from clock time
              timeTicks.map((tick, i) => (
                <text
                  key={i}
                  x={tick.x}
                  y={height - bottomPadding / 2}
                  fontSize="12"
                  textAnchor="middle"
                  fill={labelColor}
                  fontWeight="500"
                >
                  {tick.label}
                </text>
              ))
            : // Step mode: label per data point, filtered by interval
              data.map((g, gi) => (
                <text
                  key={gi}
                  x={scaleXStep(gi)}
                  y={height - bottomPadding / 2}
                  fontSize="12"
                  textAnchor="middle"
                  fill={labelColor}
                  fontWeight="500"
                >
                  {gi % interval === 0 ? g.label : ""}
                </text>
              ))}

          {/* tooltip — always mounted, floats via CSS transition on transform */}
          {(() => {
            const rawTs = hovered
              ? (hovered.tooltipLabel || hovered.label || "").trim()
              : "";
            const { date: dateLine, time: timeLine } =
              splitTooltipDateTime(rawTs);
            const valStr = hovered
              ? `Value: ${valueFormat ? valueFormat(hovered.value) : hovered.value.toLocaleString()}`
              : "";
            const dateStr = dateLine ? `Date: ${dateLine}` : "";
            const timeStr = timeLine ? `Time: ${timeLine}` : "";

            const fontDt = "10px sans-serif";
            const fontVal = "11px sans-serif";
            const padX = 10,
              padY = 8,
              lineGap = 3,
              lineH = 13;
            const widths = [
              getTextWidth(dateStr, fontDt),
              timeLine ? getTextWidth(timeStr, fontDt) : 0,
              getTextWidth(valStr, fontVal),
            ];
            const boxW = Math.max(...widths, 56) + padX * 2;
            const infoLines = timeLine ? 2 : 1;
            const totalLines = infoLines + 1;
            const boxH =
              padY * 2 + totalLines * lineH + (totalLines - 1) * lineGap;

            // All content is drawn at (0,0); the <g> is translated to position.
            // boxX/boxY are offsets relative to the anchor point (0,0).
            const boxX = -boxW / 2;
            const boxY = -boxH - 12;
            const textX = boxX + padX;
            const yDate = boxY + padY + lineH - 2;
            const yTime = timeLine ? yDate + lineH + lineGap : null;
            const yVal = timeLine
              ? yTime + lineH + lineGap
              : yDate + lineH + lineGap;

            const pos = hovered ?? prevHoveredRef.current;
            const tx = pos ? pos.x : 0;
            const ty = pos ? pos.y : 0;
            const isFirstAppear = !!hovered?._firstAppear;

            return (
              <g
                pointerEvents="none"
                style={{
                  transform: `translate(${tx}px, ${ty}px)`,
                  transition: isFirstAppear
                    ? "opacity 20ms ease"
                    : "transform 300ms ease-out, opacity 20ms ease",
                  opacity: hovered ? 1 : 0,
                }}
              >
                <rect
                  x={boxX}
                  y={boxY}
                  width={boxW}
                  height={boxH}
                  rx="4"
                  fill="var(--secondary-black)"
                />
                <text
                  x={textX}
                  y={yDate}
                  fill="var(--primary-white)"
                  fontSize="10"
                  textAnchor="start"
                  fontFamily="sans-serif"
                >
                  {dateStr}
                </text>
                {timeLine && (
                  <text
                    x={textX}
                    y={yTime}
                    fill="var(--primary-white)"
                    fontSize="10"
                    textAnchor="start"
                    fontFamily="sans-serif"
                  >
                    {timeStr}
                  </text>
                )}
                <text
                  x={textX}
                  y={yVal}
                  fill="var(--primary-white)"
                  fontSize="11"
                  textAnchor="start"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {valStr}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
