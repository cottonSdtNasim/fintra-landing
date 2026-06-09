import { useEffect, useMemo, useState } from "react";
import PieChart from "./PieChart/PieChart";
import { marketOverviewApi } from "../../../api/marketOverviewApi";
import { LoadingSpinner } from "../../common/LoadingSpinner";

export default function Overview() {
  const [marketAnalysisData, setMarketAnalysisData] = useState(null);

  useEffect(() => {
    const fetchMarketOverview = async () => {
      const result = await marketOverviewApi.getMarketOverview("overall");

      if (result && result.status) {
        setMarketAnalysisData(result.data);
      }
    };

    fetchMarketOverview();
    const interval = setInterval(fetchMarketOverview, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const pieChartData = useMemo(() => {
    if (!marketAnalysisData) return [];

    return [
      {
        label: "Gainer", // "Gainer"
        value: marketAnalysisData.gainer?.count || 0,
        color: "#00E396",
      },
      {
        label: "Unchanged", // "Unchanged""
        value: marketAnalysisData.unchanged?.count || 0,
        color: "#000000",
      },
      {
        label: "Looser", // "Looser"
        value: marketAnalysisData.loser?.count || 0,
        color: "#FF4560",
      },
    ];
  }, [marketAnalysisData]);

  if (!marketAnalysisData) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[110%] max-w-[320px]">
        <PieChart data={pieChartData} />
      </div>
    </div>
  );
}
