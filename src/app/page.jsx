import { HeroView } from "../components/layout/HeroView";
import { MarketPageView } from "../components/layout/MarketPageView";

export const metadata = {
  title: "BrokerEdge | Empowering Your Trading Journey",
  description:
    "Advanced charts, screeners, heatmaps and data solutions for share market pros. Elevate your trading with BrokerEdge.",
  keywords: [
    "share market broker",
    "stock screener",
    "market heatmap",
    "trading platform",
    "investing",
  ],
};

export default function HomePage() {
  return <MarketPageView />;
}
