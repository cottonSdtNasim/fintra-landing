import { useEffect, useMemo, useState } from "react";
import StackedBar from "./StackedBarChart/StackedBar";
import { sectorListApi } from "../../../api/sectorListApi";
import { LoadingSpinner } from "../../common/LoadingSpinner";
const header = {
  label: "Sector",
  values: [
    { text: "Up", color: "#00E396" },
    { text: "Flat", color: "#000000" },
    { text: "Down", color: "#FF4560" },
  ],
};

export default function SectorList() {
  const [marketAnalysisData, setMarketAnalysisData] = useState([]);

  useEffect(() => {
    const fetchMarketOverview = async () => {
      const result = await sectorListApi.getSectorListData();

      if (result && result.status) {
        setMarketAnalysisData(result.data);
      }
    };

    fetchMarketOverview();
    const interval = setInterval(fetchMarketOverview, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const stackedBarChartData = useMemo(() => {
    if (!marketAnalysisData) return [];

    return marketAnalysisData.map((d) => ({
      label: d.sector,
      values: [d.gainer.count, d.unchanged.count, d.loser.count],
    }));
  }, [marketAnalysisData]);

  if (marketAnalysisData.length === 0) return <LoadingSpinner />;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin pr-2">
      <div className="min-w-[200px] md:max-h-[260px]">
        <StackedBar header={header} data={stackedBarChartData} />
      </div>
    </div>
  );
}
