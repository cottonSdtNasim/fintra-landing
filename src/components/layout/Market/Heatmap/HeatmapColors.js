// utils/HeatmapColors.js
// Breakpoints: -6, -3, -1, 0, +1, +3, +6 (7 buckets)

export const HeatmapBreakpoints = [-6, -3, -1, 0, 1, 3, 6];

export const HeatmapColors = [
  "#F51E1E", // <= -6 (strong loss)
  "#552424", // -6 < x <= -3
  "#864141", // -3 < x <= -1
  "#52525B", // -1 < x < 1 (neutral)
  "#163A38", // 1 <= x < 3
  "#477F7C", // 3 <= x < 6            // old "#079600" 
  "#B7FF64", // >= 6 (strong gain)
];

export const HeatmapTextColors = [
  "#FFFFFF", // on #F51E1E
  "#FFFFFF", // on #552424
  "#FFFFFF", // on #864141
  "#FFFFFF", // on #52525B
  "#FFFFFF", // on #163A38
  "#FFFFFF", // on #079600             // old "#079600"
  "#000000", // on #B7FF64
];

/**
 * Maps a numeric change value to HeatmapColors index using breakpoints -6, -3, -1, 0, +1, +3, +6.
 */
export function GetHeatmapColorIndex(change) {
  const n = Number(change);
  if (n <= -6) return 0;
  if (n <= -3) return 1;
  if (n <= -1) return 2;
  if (n < 1) return 3; // -1 < x < 1 (includes 0)
  if (n < 3) return 4;
  if (n < 6) return 5;
  return 6; // >= 6
}

export function GetHeatmapColor(change) {
  const index = GetHeatmapColorIndex(change);
  return {
    bg: HeatmapColors[index],
    text: HeatmapTextColors[index],
  };
}
