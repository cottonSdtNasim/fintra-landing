import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Typography } from "../../common/Typography";
import Tooltip from "../../common/Tooltip";
import { GoQuestion } from "react-icons/go";
import { DataTable } from "../../common/DataTable";
import { companyDetailsApi } from "../../../api/companyDetailsApi";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import LineChart from "./Chart/LineChart";

// import AllDividendData from "../../data/dividend_data.json";
import BarChart from "./Chart/BarChart";
import { BsDatabaseSlash } from "react-icons/bs";
import NormalCard from "../../common/NormalCard";
import NormalChip from "../../common/NormalChip";

import TsetView from "../Market/Test";

const COLOR_PALETTE = ["#b7ff64", "#1B867F"];

function parseDividendAmount(amount) {
  if (amount == null || amount === "—" || amount === "-") return 0;
  if (typeof amount === "number") return amount;
  const num = parseFloat(String(amount).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

const cashColumns = [
  { header: "Year", accessor: "year" },
  // after amont show % symbol
  { header: "Amount in percentage", accessor: "amount" },
];
const stockColumns = [
  { header: "Year", accessor: "year" },
  { header: "Amount in percentage", accessor: "amount" },
];

export default function DividendHistory({ instrumentCode }) {
  const [activeChart, setActiveChart] = useState(1);
  const [showCash, setShowCash] = useState(true);
  const [showStock, setShowStock] = useState(true);
  const [cashData, setCashData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const cashLabel = "cash dividend";
  const stockLabel = "stock dividend";

  const hasChartData = cashData.length > 0 || stockData.length > 0;

  const chartData = useMemo(() => {
    const years = new Set([
      ...cashData.map((d) => String(d.year)),
      ...stockData.map((d) => String(d.year)),
    ]);
    const sortedYears = [...years].sort((a, b) => Number(a) - Number(b));
    if (!sortedYears.length) return [];

    const cashByYear = Object.fromEntries(
      cashData.map((d) => [String(d.year), parseDividendAmount(d.amount)]),
    );
    const stockByYear = Object.fromEntries(
      stockData.map((d) => [String(d.year), parseDividendAmount(d.amount)]),
    );

    return sortedYears.map((year) => {
      const bars = [];
      if (showCash) {
        bars.push({
          label: cashLabel,
          value: cashByYear[year] ?? 0,
          color: COLOR_PALETTE[0],
        });
      }
      if (showStock) {
        bars.push({
          label: stockLabel,
          value: stockByYear[year] ?? 0,
          color: COLOR_PALETTE[1],
        });
      }
      return {
        label: year,
        bars,
      };
    });
  }, [cashData, stockData, cashLabel, stockLabel, showCash, showStock]);

  const metric = useMemo(() => {
    const values = chartData
      .flatMap((g) => g.bars.map((b) => b.value))
      .filter((v) => v > 0);
    if (!values.length) return [];

    const max = Math.max(...values);
    const step = Math.ceil(max / 5) || 1;
    return Array.from({ length: 6 }, (_, i) => i * step);
  }, [chartData]);

  const fetchDividend = useCallback(async () => {
    if (!instrumentCode) {
      setCashData([]);
      setStockData([]);
      return;
    }
    setLoading(true);
    try {
      const res =
        await companyDetailsApi.getDividendHistoryData(instrumentCode);
      if (res?.success && res?.data) {
        const cash = Array.isArray(res.data.cash_dividend)
          ? res.data.cash_dividend
          : [];
        const stock = Array.isArray(res.data.stock_dividend)
          ? res.data.stock_dividend
          : [];

        setCashData(
          cash.map((row) => ({ year: row.year, amount: row.amount ?? "—" })),
        );

        setStockData(
          stock.map((row) => ({ year: row.year, amount: row.amount ?? "—" })),
        );
      } else {
        setCashData([]);
        setStockData([]);
      }
    } catch (_) {
      setCashData([]);
      setStockData([]);
    } finally {
      setLoading(false);
    }
  }, [instrumentCode]);

  useEffect(() => {
    fetchDividend();
  }, [fetchDividend]);

  return (
    <>
      <div>
        {/* <div className="col-span-3 mb-6">
          <NormalCard title="Test" tooltip="Test">
            <TsetView />
          </NormalCard>
        </div> */}
        {/* Chart Setup */}
        <div className="flex items-center gap-2 mb-4">
          <Typography
            variant="text-p"
            className="font-medium text-(--secondary-white)"
          >
            Chart Setup
          </Typography>

          <NormalCard rounded="rounded-md">
            <div className="flex gap-1 p-1">
              {/* Chart 1 */}
              <div
                onClick={() => setActiveChart(1)}
                className={`h-5 w-5 p-1 rounded-sm cursor-pointer 
                      ${activeChart === 1 ? "bg-(--tertiary-green) text-black" : "text-(--secondary-white)"}`}
              >
                <svg viewBox="0 0 14 14" fill="none" className="h-full w-full">
                  <path
                    d="M1.00049 13L3.17871 6.4M5.48894 6.85L8.40643 10M10.149 9.1L13.0005 1M5.48894 5.5C5.48894 6.24558 4.89789 6.85 4.1688 6.85C3.43972 6.85 2.84867 6.24558 2.84867 5.5C2.84867 4.75441 3.43972 4.15 4.1688 4.15C4.89789 4.15 5.48894 4.75441 5.48894 5.5ZM11.0203 10.45C11.0203 11.1956 10.4292 11.8 9.70016 11.8C8.97107 11.8 8.38003 11.1956 8.38003 10.45C8.38003 9.70442 8.97107 9.1 9.70016 9.1C10.4292 9.1 11.0203 9.70442 11.0203 10.45Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Chart 2 */}
              <div
                onClick={() => setActiveChart(2)}
                className={`h-5 w-5 p-1 rounded-sm cursor-pointer 
                 ${activeChart === 2 ? "bg-(--tertiary-green) text-black" : "text-(--secondary-white)"}`}
              >
                <svg viewBox="0 0 12 14" fill="none" className="h-full w-full">
                  <path
                    fill="currentColor"
                    d="M10.8 0C11.1183 0 11.4235 0.122916 11.6485 0.341709C11.8736 0.560501 12 0.857247 12 1.16667V12.8333C12 13.1428 11.8736 13.4395 11.6485 13.6583C11.4235 13.8771 11.1183 14 10.8 14C10.4817 14 10.1765 13.8771 9.95147 13.6583C9.72643 13.4395 9.6 13.1428 9.6 12.8333V1.16667C9.6 0.857247 9.72643 0.560501 9.95147 0.341709C10.1765 0.122916 10.4817 0 10.8 0ZM6 4.66667C6.31826 4.66667 6.62348 4.78958 6.84853 5.00838C7.07357 5.22717 7.2 5.52391 7.2 5.83333V12.8333C7.2 13.1428 7.07357 13.4395 6.84853 13.6583C6.62348 13.8771 6.31826 14 6 14C5.68174 14 5.37652 13.8771 5.15147 13.6583C4.92643 13.4395 4.8 13.1428 4.8 12.8333V5.83333C4.8 5.52391 4.92643 5.22717 5.15147 5.00838C5.37652 4.78958 5.68174 4.66667 6 4.66667ZM2.4 9.33333C2.4 9.02391 2.27357 8.72717 2.04853 8.50838C1.82348 8.28958 1.51826 8.16667 1.2 8.16667C0.88174 8.16667 0.576515 8.28958 0.351472 8.50838C0.126428 8.72717 0 9.02391 0 9.33333V12.8333C0 13.1428 0.126428 13.4395 0.351472 13.6583C0.576515 13.8771 0.88174 14 1.2 14C1.51826 14 1.82348 13.8771 2.04853 13.6583C2.27357 13.4395 2.4 13.1428 2.4 12.8333V9.33333Z"
                  />
                </svg>
              </div>
            </div>
          </NormalCard>
          <Typography
            variant="text-p"
            className="font-medium text-(--secondary-white) md:ml-6"
          >
            Dividend Type
          </Typography>

          <NormalCard rounded="rounded-md  ">
            <div className="flex items-center gap-4 p-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCash}
                  onChange={(e) => setShowCash(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: COLOR_PALETTE[0] }}
                />
                <Typography variant="text14">Cash</Typography>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showStock}
                  onChange={(e) => setShowStock(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: COLOR_PALETTE[1] }}
                />
                <Typography variant="text14">Stock</Typography>
              </label>
            </div>
          </NormalCard>
        </div>
      </div>

      <div className="mb-4">
        <NormalCard>
          <div className="px-4 py-8">
            <div className="aspect-16/8 min-h-[300px] min-w-[600px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              ) : !hasChartData ? (
                <div className="flex flex-col items-center justify-center gap-2 h-full">
                  <BsDatabaseSlash className="w-10 h-10 text-light_gray_text_color" />
                  <Typography>No Divident Data</Typography>
                </div>
              ) : activeChart === 1 ? (
                <LineChart
                  valueFormat={(v) => `${v}%`}
                  data={chartData}
                  metric={metric}
                  colorPalette={COLOR_PALETTE}
                  stepType="middle"
                />
              ) : (
                <BarChart
                  valueFormat={(v) => `${v}%`}
                  data={chartData}
                  metric={metric}
                  colorPalette={COLOR_PALETTE}
                />
              )}
            </div>

            {/* {hasChartData && !loading && (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: COLOR_PALETTE[0] }}
                  />
                  <Typography variant="text-14">{cashLabel}</Typography>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: COLOR_PALETTE[1] }}
                  />
                  <Typography variant="text-14">{stockLabel}</Typography>
                </div>
              </div>
            )} */}
          </div>
        </NormalCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NormalCard
          title={"Cash Dividend"}
          tooltip={"Details about cash dividends"}
        >
          <div className="mt-3">
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <LoadingSpinner />
              </div>
            ) : cashData.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 h-60">
                <BsDatabaseSlash className="w-10 h-10 text-light_gray_text_color" />
                <Typography>No Data Available</Typography>
              </div>
            ) : (
              <DataTable
                columns={cashColumns}
                data={cashData}
                noDataMessage="No Data Available"
              />
            )}
          </div>
        </NormalCard>

        <NormalCard
          title={"Stock Dividend"}
          tooltip={"Details about stock dividends"}
        >
          <div className="mt-3">
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <LoadingSpinner />
              </div>
            ) : stockData.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 h-60">
                <BsDatabaseSlash className="w-10 h-10 text-light_gray_text_color" />
                <Typography>No Data Available</Typography>
              </div>
            ) : (
              <DataTable
                columns={stockColumns}
                data={stockData}
                noDataMessage="No Data Available"
              />
            )}
          </div>
        </NormalCard>
      </div>
    </>
  );
}
