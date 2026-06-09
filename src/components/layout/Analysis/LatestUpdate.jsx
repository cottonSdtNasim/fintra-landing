import React, { useMemo, useState } from "react";
// import TabNavigation from "../BOAccountComponents/PreviewComponents/TabNavigation";
import { Typography } from "../../common/Typography";
import NewsModal from "./NewsModal";
import { useLanguageStore } from "../../../stores/useLanguageStore";
import Tabs from "../../common/Tabs";

const TABS = [
  { id: "agm", label: "AGM" },
  { id: "quarterly", label: "Quarterly" },
  { id: "performance", label: "Performance" },
];

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return "—";
  const d = new Date(dateTimeStr.replace(" ", "T"));
  if (isNaN(d.getTime())) return dateTimeStr;
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
}

export default function LatestUpdate({ companyLatestNews }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [selectedNews, setSelectedNews] = useState(null);
  const t = useLanguageStore((s) => s.t);

  const activePayload = useMemo(() => {
    if (!companyLatestNews) return null;
    return companyLatestNews?.[activeTab] ?? null;
  }, [companyLatestNews, activeTab]);

  const rows = activePayload?.data ?? [];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0">
        <Tabs
        layoutScopeId="latest_update"
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          layoutScopeId="latest-update-sub"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mt-2">
        {rows.length === 0 ? (
          <div className="flex justify-center items-center py-6 text-light_gray_text_color">
            <Typography variant="text12">No updates available</Typography>
          </div>
        ) : (
          rows.map((item, index) => (
            <div
              key={`${item.MAN_ANNOUNCEMENT_DATE_TIME}-${index}`}
              onClick={() => setSelectedNews(item)}
              className="cursor-pointer"
            >
              <div className="flex flex-col border-b border-light_gray_text_color/30 py-2">
                <div className="flex justify-end items-center mb-1 gap-2">
                  <Typography
                    variant="text12"
                    className="text-light_gray_text_color shrink-0"
                  >
                    {formatDateTime(item.MAN_ANNOUNCEMENT_DATE_TIME)}
                  </Typography>
                </div>
                <Typography variant="text12">
                  {item.MAN_ANNOUNCEMENT}
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>

      {/* News Modal */}
      <NewsModal
        title={`${TABS.find((tab) => tab.id === activeTab)?.label} Latest Update`}
        isOpen={selectedNews !== null}
        news={{
          headline: null,
          content: selectedNews?.MAN_ANNOUNCEMENT,
          timestamp: selectedNews?.MAN_ANNOUNCEMENT_DATE_TIME,
          source: "dsebd.org"
        }}
        onClose={() => setSelectedNews(null)}
      />
    </div>
  );
}
