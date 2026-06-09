import React, { useEffect, useState, useCallback } from "react";
import { Typography } from "../../common/Typography";
import { companyDetailsApi } from "../../../api/companyDetailsApi";
import { DataTable } from "../../common/DataTable";
import NormalCard from "../../common/NormalCard";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { BsDatabaseSlash } from "react-icons/bs";
import { Pagination } from "../../common/Pagination";
import { PageFilter } from "../../common/PageFilter";

const columns = [
  { header: "Date", accessor: "date", align: "left" },
  {
    header: "Sponsor/Director",
    accessor: "director",
    render: (row) => `${Number(row.director || 0).toFixed(2)}%`,
    align: "center",
  },
  {
    header: "Govt",
    accessor: "govt",
    render: (row) => `${Number(row.govt || 0).toFixed(2)}%`,
    align: "center",
  },
  {
    header: "Institute",
    accessor: "institute",
    render: (row) => `${Number(row.institute || 0).toFixed(2)}%`,
    align: "center",
  },
  {
    header: "Foreign",
    accessor: "foreign_holding",
    render: (row) => `${Number(row.foreign_holding || 0).toFixed(2)}%`,
    align: "center",
  },
  {
    header: "Public",
    accessor: "public_holding",
    render: (row) => `${Number(row.public_holding || 0).toFixed(2)}%`,
    align: "center",
  },
];

export default function OwnershipTab({ instrumentCode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Reset to page 1 if instrumentCode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [instrumentCode]);

  const fetchData = useCallback(async () => {
    if (!instrumentCode) {
      setData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await companyDetailsApi.getOwnershipData(
        instrumentCode,
        currentPage,
        perPage,
      );
      if (res?.success && Array.isArray(res?.data)) {
        setData(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setData([]);
      }
    } catch (_) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [instrumentCode, currentPage, perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mt-6">
      <NormalCard
        title="Ownership"
        tooltip="Details about ownership distribution"
      >
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <LoadingSpinner />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 h-60">
            <BsDatabaseSlash className="w-10 h-10 text-(--primary-white)/30" />
            <Typography className="text-(--primary-white)/50">
              No Data Available
            </Typography>
          </div>
        ) : (
          <div className="flex flex-col mt-5">
            <DataTable
              columns={columns}
              data={data}
              noDataMessage="No Data Available"
            />
            {/* {pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <PageFilter
                  perPage={perPage}
                  setPerPage={(val) => {
                    setPerPage(val);
                    setCurrentPage(1);
                  }}
                />
                {pagination.last_page > 1 && (
                  <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.last_page}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            )} */}
          </div>
        )}
      </NormalCard>
    </div>
  );
}
