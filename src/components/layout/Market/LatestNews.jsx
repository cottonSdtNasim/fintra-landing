"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Typography } from "../../common/Typography";
import NewsModal from "../../common/NewsModal";
import { latestNewsApi } from "../../../api/latestNewsApi";
import { LoadingSpinner } from "../../common/LoadingSpinner";

const TOOLTIP_TEXT = "Latest news and updates about the market";
const NEWS_POLL_INTERVAL = 30 * 1000; // 30 seconds

// -------- SCROLL CONFIG --------
const AUTO_SCROLL_DELAY = 5000; // wait before starting (ms)
const FPS = 30; // Max Speed
const RESET_SCROLL_DELAY = 30; // tiny delay before jumping to top
// -------------------------------

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return "—";
  const d = new Date(dateTimeStr.replace(" ", "T"));
  if (isNaN(d.getTime())) return dateTimeStr;
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
}

export default function LatestNews() {
  //   const { t } = useLanguage();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null); // ✅ added

  const containerRef = useRef(null);
  const hoverRef = useRef(false);
  const animationRef = useRef(null);
  const isInitialLoad = useRef(true);

  const fetchLatestNews = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    const res = await latestNewsApi.getLatestNews();
    if (showLoader) setLoading(false);

    if (res?.status && Array.isArray(res.data)) {
      setData(res.data);
    } else {
      setData([]);
    }
  }, []);

  useEffect(() => {
    fetchLatestNews(isInitialLoad.current);
    isInitialLoad.current = false;

    const interval = setInterval(
      () => fetchLatestNews(false),
      NEWS_POLL_INTERVAL,
    );
    return () => clearInterval(interval);
  }, [fetchLatestNews]);

  const FRAME_DURATION = 1000 / FPS;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastTime = 0;

    const startScrolling = () => {
      const step = (time) => {
        if (!el) return;

        const delta = time - lastTime;

        if (delta >= FRAME_DURATION) {
          lastTime = time;

          if (!hoverRef.current) {
            const maxScroll = el.scrollHeight - el.clientHeight;

            // Only scroll if content is actually scrollable
            if (maxScroll > 0) {
              if (el.scrollTop >= maxScroll - 1) {
                // -1 for subpixel safety
                setTimeout(() => {
                  if (el) el.scrollTop = 0;
                }, RESET_SCROLL_DELAY);
              } else {
                el.scrollTop += 1;
              }
            }
          }
        }

        animationRef.current = requestAnimationFrame(step);
      };

      animationRef.current = requestAnimationFrame(step);
    };

    const delay = setTimeout(startScrolling, AUTO_SCROLL_DELAY);

    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(animationRef.current);
    };
  }, [data]);

  return (
    <div className="flex flex-col rounded-lg p-2 h-[420px] w-full">
      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center py-6 text-light_gray_text_color">
          No news available
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex-1 min-h-0 overflow-y-auto scrollbar-thin overflow-x-hidden"
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
        >
          {data.map((item, index) => (
            <div
              key={`${item.MAN_ANNOUNCEMENT_DATE_TIME}-${index}`}
              onClick={() => {
                setSelectedNews(item);
              }}
              className="cursor-pointer flex flex-col border-b last:border-b-0 py-2 mb-5"
            >
              <div className="flex justify-between items-center mb-1 gap-2">
                <Typography variant="text14">
                  {item.MAN_ANNOUNCEMENT_PREFIX}
                </Typography>

                <Typography
                  variant="text12"
                  className="text-[#52525B] shrink-0"
                >
                  {formatDateTime(item.MAN_ANNOUNCEMENT_DATE_TIME)}
                </Typography>
              </div>

              <Typography variant="text12">{item.MAN_ANNOUNCEMENT}</Typography>
            </div>
          ))}
        </div>
      )}

      {/* News Modal */}
      <NewsModal
        title="Latest News"
        isOpen={selectedNews !== null}
        news={{
          headline: selectedNews?.MAN_ANNOUNCEMENT_PREFIX,
          content: selectedNews?.MAN_ANNOUNCEMENT,
          timestamp: selectedNews?.MAN_ANNOUNCEMENT_DATE_TIME,
          source: "dsebd.org",
        }}
        onClose={() => setSelectedNews(null)}
      />
    </div>
  );
}
