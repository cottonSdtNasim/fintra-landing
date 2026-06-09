import { PageView } from "../../components/layout/PageView";

export const metadata = {
  title: "Data Tables | BrokerEdge",
  description:
    "Comprehensive financial, fundamental, and technical data formatted for deep market analysis.",
  keywords: [
    "financial data",
    "stock market tables",
    "fundamental data",
    "technical indicators",
    "broker platform",
  ],
};

export default function TablePage() {
  return <PageView titleKey="table_title" descKey="table_desc" />;
}
