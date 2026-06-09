"use client";

import { Typography } from "../common/Typography";
import { Card } from "../common/Card";
import { Link } from "../common/Link";
import Tabs from "../common/Tabs";
// import { DataTable } from "../common/DataTable";
import { useEffect, useState } from "react";
import ContactInfo from "./Analysis/ContactInfo";
import OverviewTab from "./Analysis/OverviewTab";
import { companyDetailsApi } from "../../api/companyDetailsApi";
import NewsTab from "./Analysis/NewsTab";
import DividendHistory from "./Analysis/DividendHistory";
import OwnershipTab from "./Analysis/OwnershipTab";
import TickerSearch from "./TickerSearch";

// const dividendColumns = [
//   { header: "Year", accessor: "year", align: "left" },
//   {
//     header: "Dividend %",
//     accessor: "dividend",
//     align: "center",
//     render: (row) => (
//       <span className="text-(--tertiary-green)">{row.dividend}%</span>
//     ),
//   },
//   { header: "Record Date", accessor: "recordDate", align: "center" },
//   { header: "AGM Date", accessor: "agmDate", align: "center" },
//   { header: "Remarks", accessor: "remarks", align: "left" },
// ];

// const generateDividendData = () => {
//   const data = [];
//   for (let i = 0; i < 45; i++) {
//     data.push({
//       year: 2023 - i,
//       dividend: (Math.random() * 20 + 5).toFixed(2),
//       recordDate: `12-Nov-${2023 - i}`,
//       agmDate: `24-Dec-${2023 - i}`,
//       remarks:
//         i % 3 === 0
//           ? "Cash Dividend"
//           : i % 2 === 0
//             ? "Stock Dividend"
//             : "Interim Dividend",
//     });
//   }
//   return data;
// };

// const dividendData = generateDividendData();

const tabsData = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "research", label: "Research" },
  { id: "news", label: "News" },
  { id: "ownership", label: "Ownership" },
  { id: "dividend", label: "Dividend History" },
  { id: "contact", label: "Contact Info" },
];

export function SecurityCodePageView({ securityCode }) {
  // Decode the URL parameter safely in case it contains URL-encoded characters
  const instrumentCode = decodeURIComponent(securityCode).toUpperCase();

  const demoCodes = ["BATBC", "GP", "SQURPHARMA", "RENATA", "BEXIMCO"];
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const [snapshot, setSnapshot] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [companyLatestNews, setCompanyLatestNews] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSnapshot = async () => {
      if (!instrumentCode) {
        setLoading(false);
        setSnapshot(null);
        setCompanyInfo(null);
        setCompanyLatestNews(null);
        return;
      }
      setLoading(true);
      try {
        const res =
          await companyDetailsApi.getInstrumentSnapshot(instrumentCode);
        if (cancelled) return;
        if (res?.status) {
          setSnapshot(res.data ?? null);
          setCompanyInfo(res.company_info ?? null);
          setCompanyLatestNews(res.company_latest_news ?? null);
        } else {
          setSnapshot(null);
          setCompanyInfo(null);
          setCompanyLatestNews(null);
        }
      } catch (_) {
        if (!cancelled) {
          setSnapshot(null);
          setCompanyInfo(null);
          setCompanyLatestNews(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSnapshot();
    return () => {
      cancelled = true;
    };
  }, [instrumentCode]);

  return (
    <div className="container mx-auto px-4 md:px-[calc(10vw-3rem)] py-20 mt-16">
      {/* <div className="mb-10 pt-10">
        <Typography variant="h2" className="text-center mb-5 text-white">
          Analysis for {instrumentCode}
        </Typography>
        <Typography
          variant="p"
          className="text-center text-secondary-white mb-8"
        >
          Detailed technical and fundamental analysis for this security.
        </Typography>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {demoCodes.map((code) => (
            <Link
              key={code}
              href={`/analysis/${code}`}
              variant={instrumentCode === code ? "primary" : "secondary"}
              className="justify-center min-w-[120px]"
            >
              {code}
            </Link>
          ))}
        </div>
      </div> */}

      <TickerSearch />

      <Tabs layoutScopeId="analysis_main" tabs={tabsData} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" ? (
        <OverviewTab
          instrumentCode={instrumentCode}
          companyInfo={companyInfo}
          companyLatestNews={companyLatestNews}
        />
      ) : activeTab === "contact" ? (
        <ContactInfo instrumentCode={instrumentCode} />
      ) : activeTab === "news" ? (
        <NewsTab instrumentCode={instrumentCode} />
      ) : activeTab === "ownership" ? (
        <OwnershipTab instrumentCode={instrumentCode} />
      ) : activeTab === "dividend" ? (
        <DividendHistory instrumentCode={instrumentCode} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="col-span-1 md:col-span-3">
            <div className="flex flex-col h-full p-6 rounded-[10px] min-h-[400px] items-center justify-center bg-(--secondary-black)">
              <Typography
                variant="h3"
                className="text-white text-center capitalize"
              >
                {activeTab} Data Will Appear Here
              </Typography>
              <Typography
                variant="p"
                className="text-secondary-white text-center mt-4"
              >
                This is a dynamic route placeholder for the security code:{" "}
                <strong>{instrumentCode}</strong>.
              </Typography>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
