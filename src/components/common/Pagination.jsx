"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function Pagination({ currentPage, totalPages, onPageChange, totalEntries, startIndex, currentDataLength }) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pageNumbers;
  };

  if (totalPages <= 1 && totalEntries === 0) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-(--primary-white)/5 gap-4">
      <div className="text-(--primary-white)/50 text-sm">
        Showing {totalEntries === 0 ? 0 : startIndex + 1} to {startIndex + currentDataLength} of {totalEntries} entries
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-(--primary-white)/50 hover:text-(--primary-white) disabled:opacity-50 disabled:hover:text-(--primary-white)/50 transition-colors"
          >
            <FiChevronLeft className="text-lg" />
          </button>

          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === "number" ? onPageChange(page) : null}
              disabled={typeof page !== "number"}
              className={`min-w-[32px] h-[32px] flex items-center justify-center rounded-[4px] text-sm transition-colors ${
                currentPage === page
                  ? "bg-(--secondary-green) text-(--primary-white)"
                  : typeof page === "number"
                  ? "text-(--primary-white)/50 hover:text-(--primary-white) hover:bg-(--primary-white)/5"
                  : "text-(--primary-white)/50 cursor-default"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-(--primary-white)/50 hover:text-(--primary-white) disabled:opacity-50 disabled:hover:text-(--primary-white)/50 transition-colors"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
