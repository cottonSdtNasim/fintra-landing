import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Typography } from "../../common/Typography";
import Tooltip from "../../common/Tooltip";
import { DataTable } from "../../common/DataTable";
import { GoQuestion } from "react-icons/go";
import Tabs from "../../common/Tabs";
import { topTenApi } from "../../../api/topTenApi";
import { LoadingSpinner } from "../../common/LoadingSpinner";

import { PageFilter } from "../../common/PageFilter";
import { Pagination } from "../../common/Pagination";

const TABS = [
  { id: "trades", label: "By Trade" },
  { id: "value", label: "By Value" },
  { id: "volume", label: "By Volume" },
];

function ChangeCell({ val }) {
  if (val == null || val === "" || Number.isNaN(Number(val))) return <span>-</span>;
  const n = Number(val);
  const sign = n > 0 ? "+" : "";
  const colorClass = n > 0 ? "text-[#B7FF64]" : n < 0 ? "text-[#FF2C2C]" : "text-white";
  return <span className={colorClass}>{`${sign}${n.toFixed(2)}%`}</span>;
}

function formatNumber(val) {
  if (val == null || val === "") return "-";
  const n = Number(val);
  if (Number.isNaN(n)) return String(val);
  return n.toLocaleString();
}

function formatMarginable(code) {
  return code;
}

export default function TopTenShares() {
  const [activeTab, setActiveTab] = useState("trades");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1); // Reset page on tab change
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;

    const loadTopTenData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await topTenApi.getTopTenData(activeTab);
        if (isMounted) {
          const dataArray = Array.isArray(result) ? result : (result && Array.isArray(result.data) ? result.data : null);
          if (dataArray) {
            setData(dataArray);
          } else {
            setError("Failed to load data");
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTopTenData();
    const interval = setInterval(loadTopTenData, 30 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeTab]);

  const columnsByTrade = useMemo(
    () => [
      {
        header: "Company",
        accessor: "INSTRUMENT_CODE",
        render: (row) => formatMarginable(row.INSTRUMENT_CODE),
      },
      {
        header: "CHANGE %",
        accessor: "CHANGE_PCT_YDAY_CLOSE",
        render: (row) => <ChangeCell val={row.CHANGE_PCT_YDAY_CLOSE} />,
      },
      { header: "LTP", accessor: "LAST_TRADED_PRICE" },
      { header: "CLOSE PRICE", accessor: "YDAY_CLOSE_PRICE" },
      { header: "MOVING RANGE", accessor: "MOVING_RANGE_52W" },
      {
        header: "TOTAL TRADES",
        accessor: "TOTAL_TRADES",
        render: (row) => formatNumber(row.TOTAL_TRADES),
      },
    ],
    [],
  );

  const columnsByValue = useMemo(
    () => [
      {
        header: "Company",
        accessor: "INSTRUMENT_CODE",
        render: (row) => formatMarginable(row.INSTRUMENT_CODE),
      },
      {
        header: "CHANGE %",
        accessor: "CHANGE_PCT_YDAY_CLOSE",
        render: (row) => <ChangeCell val={row.CHANGE_PCT_YDAY_CLOSE} />,
      },
      { header: "LTP", accessor: "LAST_TRADED_PRICE" },
      { header: "CLOSE PRICE", accessor: "YDAY_CLOSE_PRICE" },
      { header: "MOVING RANGE", accessor: "MOVING_RANGE_52W" },
      {
        header: "TOTAL VALUE",
        accessor: "TOTAL_VALUE",
        render: (row) => formatNumber(row.TOTAL_VALUE),
      },
    ],
    [],
  );

  const columnsByVolume = useMemo(
    () => [
      {
        header: "Company",
        accessor: "INSTRUMENT_CODE",
        render: (row) => formatMarginable(row.INSTRUMENT_CODE),
      },
      {
        header: "CHANGE %",
        accessor: "CHANGE_PCT_YDAY_CLOSE",
        render: (row) => <ChangeCell val={row.CHANGE_PCT_YDAY_CLOSE} />,
      },
      { header: "LTP", accessor: "LAST_TRADED_PRICE" },
      { header: "CLOSE PRICE", accessor: "YDAY_CLOSE_PRICE" },
      { header: "MOVING RANGE", accessor: "MOVING_RANGE_52W" },
      {
        header: "TOTAL VOLUME",
        accessor: "TOTAL_VOLUME",
        render: (row) => formatNumber(row.TOTAL_VOLUME),
      },
    ],
    [],
  );

  const columns =
    activeTab === "trades"
      ? columnsByTrade
      : activeTab === "value"
        ? columnsByValue
        : columnsByVolume;

  // Pagination derived state
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="mb-2">
        <Tabs
          layoutScopeId="top_ten_shares"
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          width="w-full"
        />
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <Typography className="text-red-500">{error}</Typography>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* <PageFilter
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            /> */}
            <DataTable columns={columns} data={currentData} />
            {/* <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalEntries={data.length}
              startIndex={startIndex}
              currentDataLength={currentData.length}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
}
