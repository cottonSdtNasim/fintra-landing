"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useThemeStore } from "../../stores/useThemeStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const dataset = {
  label: "NIFTY 50",
  data: [21500, 21850, 22100, 21900, 22450, 22800, 23150],
  borderColor: "rgb(37, 99, 235)",
  backgroundColor: "rgba(37, 99, 235, 0.15)",
  fill: true,
  tension: 0.35,
};

export function MarketChart() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";
  const gridColor = isDark
    ? "rgba(148, 163, 184, 0.15)"
    : "rgba(15, 23, 42, 0.08)";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="h-[360px] w-full">
      <Line
        data={{ labels, datasets: [dataset] }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: textColor },
            },
          },
          scales: {
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
          },
        }}
      />
    </div>
  );
}
