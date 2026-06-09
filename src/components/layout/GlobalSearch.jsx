"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { Typography } from "../common/Typography";
import { useRouter } from "next/navigation";
import { companyDetailsApi } from "../../api/companyDetailsApi";
// import { companyDetailsApi } from "../api/CompanyDetails/companyDetailsApi";
// import MarginableIcon from "../shared/dynamic-icons/MarinableIcon";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "research", label: "Research" },
  { id: "news", label: "News" },
  { id: "dividend-history", label: "Dividend" },
  { id: "contact-info", label: "Contact" },
];

function normSearchStr(v) {
  return String(v ?? "").toLowerCase();
}

export default function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const placeholder = "Search";
  const [filteredData, setFilteredData] = useState([]);

  // const { data, loading } = useInstrumentData();
  const [data, setData] = useState(null);
  const [leading, setLoading] = useState(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const fetchList = async () => {
      setLoading(true);
      const res = await companyDetailsApi.getSecurityCompanyInfo();
      if (cancelled) return;
      if (res?.status && Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
      setLoading(false);
    };
    fetchList();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "/":
            event.preventDefault();
            inputRef.current?.focus();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputRef]);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
    },
    [data],
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setFilteredData([]);
  }, [data]);

  const handleItemClick = useCallback(
    (item) => {
      setSearchTerm("");
      setFilteredData([]);
      router.push(`/analysis/${item.security_code}`);
    },
    [router],
  );

  const handleTokenClick = useCallback(
    (item, tab) => {
      setSearchTerm("");
      setFilteredData([]);
      router.push(`/analysis/${item.security_code}`);
    },
    [router],
  );

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData([]);
      return;
    }

    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);

    const filtered = data.filter((item) => {
      const nameWords = normSearchStr(item.company_name).split(" ").filter(Boolean);
      const sectorWords = normSearchStr(item.sector).split(" ").filter(Boolean);
      const code = normSearchStr(item.security_code);

      const matchesName = searchWords.every((sw) =>
        nameWords.some((nw) => nw.startsWith(sw)),
      );

      const matchesSector = searchWords.every((sw) =>
        sectorWords.some((sw2) => sw2.startsWith(sw)),
      );

      const matchesCode = searchWords.every((sw) => code.startsWith(sw));

      return matchesName || matchesSector || matchesCode;
    });

    setFilteredData(filtered);
  }, [searchTerm, data]);

  const highlightStartsWith = (text, searchTerm) => {
    if (!searchTerm) return text ?? "";

    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const safe = String(text ?? "");

    return safe.split(" ").map((word, i) => {
      const match = searchWords.find((sw) => word.toLowerCase().startsWith(sw));

      if (match) {
        return (
          <span key={i}>
            <span className="text-(--tertiary-green)">
              {word.slice(0, match.length)}
            </span>
            {word.slice(match.length)}{" "}
          </span>
        );
      }

      return word + " ";
    });
  };

  return (
    <>
      <div className="relative w-full">
        <div className="rounded-md bg-(--secondary-black) p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 p-1">
              <FiSearch className="w-full h-full text-[#AAB2B2]" />
            </div>

            <div className="grow">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setFocused(true)} // ✅ added
                onBlur={() => {
                  setTimeout(() => setFocused(false), 150); // ✅ added (fix click issue)
                }}
                placeholder={placeholder}
                className="bg-transparent text-[#AAB2B2] w-full focus:ring-2 focus:ring-transparent focus:border-(--white15) outline-none"
              ></input>
            </div>

            {!focused && (
              <div
                onClick={() => { inputRef.current?.focus() }}
                className="bg-(--secondary-white)/10 text-(--secondary-white) rounded-md px-3 py-1 cursor-pointer">
                <Typography variant="Span12" className="whitespace-nowrap">{"Press /"}</Typography>
              </div>
            )}

            {searchTerm && (
              <div className="w-8 h-8">
                <button
                  onClick={handleClearSearch}
                  className="p-1 text-[#AAB2B2] hover:text-(--primary-white)"
                >
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="absolute h-0 z-50">
          {focused && searchTerm && ( // ✅ changed condition only
            <div
              className="mt-1 grid grid-rows-[auto_1fr_auto]
                rounded border border-(--white15) bg-(--secondary-black) 
                shadow-[2px_2px_6px_rgba(0,0,0,0.15)]"
            >
              <Typography className="py-2 px-2 md:px-4">
                Search Results
              </Typography>

              <div className="max-h-[300px] overflow-y-auto border-y border-(--white15) scrollbar-thin">
                {Array.isArray(filteredData) && filteredData.length > 0 ? (
                  filteredData.map((item, idx) => (
                    <div
                      key={item.security_code ?? `global-search-${idx}`}
                      onClick={() => handleItemClick(item)}
                      className="px-2 md:px-4 py-2 hover:bg-white/10 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <Typography
                            variant="text14"
                            className="font-semibold truncate"
                          >
                            {highlightStartsWith(item.company_name, searchTerm)}
                          </Typography>

                          <div className="flex items-center gap-1">
                            <Typography
                              variant="text12"
                              className="text-(--tertiary-white) shrink-0"
                            >
                              {highlightStartsWith(
                                item.security_code,
                                searchTerm,
                              )}
                            </Typography>

                            {/* <MarginableIcon isMarginable={item?.marginable === "Y"} /> */} {/* Marginable icon temporarily disabled */}
                          </div>

                        </div>

                        <Typography
                          variant="text12"
                          className="text-(--tertiary-white) mt-1"
                        >
                          {highlightStartsWith(item.sector, searchTerm)}
                        </Typography>
                      </div>

                      <div className="hidden md:flex gap-2 justify-end">
                        {TABS.map((tab) => (
                          <div key={tab.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTokenClick(item, tab.id);
                            }}
                            className="bg-(--white15) px-4 rounded-lg hover:bg-(--secondary-green) hover:text-(--primary-white) transition-colors">
                            {tab.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>

              <div className="py-2 px-2 md:px-4">
                {filteredData.length > 0 ? (
                  <div>
                    <p className="text-(--tertiary-white) text-xs">
                      {filteredData.length} Result
                      {filteredData.length > 1 ? "s" : ""} Found
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-(--primary-red) text-xs">
                      No Results Found
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}