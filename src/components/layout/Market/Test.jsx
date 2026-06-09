"use client";
import { useEffect, useRef } from "react";
// import { marketOverviewApi } from "../../../api/marketOverviewApi";
import { sectorListApi } from "../../../api/sectorListApi";
import { companyDetailsApi } from "../../../api/companyDetailsApi";

export default function TsetView() {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadMarketData = async () => {
      try {
        const response =
          await companyDetailsApi.getDividendHistoryData("SQURPHARMA");
      } catch (error) {
        console.error("Failed to fetch dividend history:", error);
      }
    };

    loadMarketData();
  }, []);

  return <div className=""></div>;
}

// useEffect(() => {
//   if (hasFetched.current) return;
//   hasFetched.current = true;

//   const loadMarketData = async () => {
//     try {
//       const response = await fetchMarketIndexSnapshotLate();
//       console.log("Market Snapshot Response:", response);
//     } catch (error) {
//       console.error("Failed to fetch market snapshot:", error);
//     }
//   };

//   loadMarketData();
// }, []);

// // test api of getSecurityCompanyInfo with console.log
