import { useEffect, useState } from "react";
import { Typography } from "../../common/Typography";
import { BsBoxArrowInUpRight } from "react-icons/bs";
import NewsModal from "../../common/NewsModal";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import { companyDetailsApi } from "../../../api/companyDetailsApi";
import { useLanguageStore } from "../../../stores/useLanguageStore";
import NormalCard from "../../common/NormalCard";

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return "—";
  const d = new Date(dateTimeStr.replace(" ", "T"));
  if (isNaN(d.getTime())) return dateTimeStr;
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
}

export default function NewsTab({ instrumentCode }) {
  const t = useLanguageStore((s) => s.t);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [selectedNews, setSelectedNews] = useState(null);

  const fetchNews = async (pageNumber = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const perPage = 10;
      const res = await companyDetailsApi.getManByInstrument(
        instrumentCode,
        pageNumber,
        perPage,
      );

      if (res?.status && Array.isArray(res.data)) {
        if (append) {
          setNews((prev) => [...prev, ...res.data]);
        } else {
          setNews(res.data);
        }

        setPage(res.page);

        if (res.count < perPage) {
          setHasMore(false);
        }
      } else {
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNews(1, false);
  }, [instrumentCode]);

  const loadMore = () => {
    fetchNews(page + 1, true);
  };

  return (
    <div>
      <NormalCard
        // title={t["companyDetails.latestDseNews.title"]}
        // tooltip={t["companyDetails.latestDseNews.tooltip"]}
        title="Latest DSE News"
        tooltip="Latest DSE News"
      >
        <div className="p-4 flex-1 overflow-y-auto scrollbar-thin min-h-0">
          {loading && <LoadingSpinner />}

          {!loading && (
            <>
              {news.map((item, index) => (
                <div
                  key={index}
                  className="cursor-pointer mb-5"
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="flex flex-col border-b border-light_gray_text_color/30 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <Typography variant="text14">
                          {item.MAN_ANNOUNCEMENT_PREFIX}
                        </Typography>

                        <BsBoxArrowInUpRight className="text-[#52525B] p-0.5" />
                      </div>

                      <Typography variant="text12" className="text-[#52525B] shrink-0">
                        {formatDateTime(item.MAN_ANNOUNCEMENT_DATE_TIME)}
                      </Typography>
                    </div>

                    <Typography variant="text12">
                      {item.MAN_ANNOUNCEMENT}
                    </Typography>
                  </div>
                </div>
              ))}

              {!loadingMore && !hasMore && news.length === 0 && (
                <div className="flex items-center justify-center h-full min-h-80">
                  <Typography className="text-light_red_color">
                    {t["companyDetails.latestDseNews.noNews"]}
                  </Typography>
                </div>
              )}

              {/* Load More */}
              <div className="flex justify-center pt-3">
                {loadingMore && (
                  <div className="flex items-center justify-center py-2">
                    <LoadingSpinner />
                  </div>
                )}

                {!loadingMore && hasMore && (
                  <button
                    onClick={loadMore}
                    className="text-sm text-[#1B867F] hover:underline"
                  >
                    Load More
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </NormalCard>

      {/* News Modal */}
      <NewsModal
        isOpen={selectedNews !== null}
        news={{
          headline: selectedNews?.MAN_ANNOUNCEMENT_PREFIX,
          content: selectedNews?.MAN_ANNOUNCEMENT,
          timestamp: formatDateTime(selectedNews?.MAN_ANNOUNCEMENT_DATE_TIME),
          source: "dsebd.org",
        }}
        onClose={() => setSelectedNews(null)}
      />
    </div>
  );
}
