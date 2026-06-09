import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import PriceChangeIndicator from "../common/PriceChangeIndicator";
import NextLink from "next/link";
import { companyDetailsApi } from "../../api/companyDetailsApi";
import NormalChip from "../common/NormalChip";

export default function Ticker() {
  // const navigate = useNavigate();
  const [latestSnapshot, setLatestSnapshot] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const reFetch = useCallback(async () => {
    const result = await companyDetailsApi.getSecurityCompanyInfo();
    if (result && result.status) {
      setLatestSnapshot(result.data);
    }
  }, []);

  useEffect(() => {
    reFetch();
    const interval = setInterval(reFetch, 30 * 1000);
    return () => clearInterval(interval);
  }, [reFetch]);

  const latestData = useMemo(() => {
    return latestSnapshot.map((s) => ({
      instrumentCode: s.security_code,
      sign: Math.sign(Number(s.CHANGE_YDAY_CLOSE)),
      change: s.CHANGE_YDAY_CLOSE,
      changePercent: s.CHANGE_PCT_YDAY_CLOSE,
      // "change": s.LAST_TRADED_PRICE,
      // "changePercent": Number(
      //   (100 * (s.LAST_TRADED_PRICE - s.YDAY_CLOSE_PRICE) / s.YDAY_CLOSE_PRICE).toFixed(2)
      // )
    })); //.slice(0, 5); //--temp [take last 5]
  }, [latestSnapshot]);

  const tickerContentRef = useRef(null);
  const extendedData = [...latestData, ...latestData];

  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const translateXRef = useRef(0);
  const speed = 1.5; // Adjust speed here (pixels per frame)

  const animate = useCallback(
    (time) => {
      if (previousTimeRef.current !== undefined && !isPaused) {
        const deltaTime = time - previousTimeRef.current;

        // Move left
        translateXRef.current -= speed * (deltaTime / 16); // Normalize to ~60fps

        const tickerContent = tickerContentRef.current;
        if (tickerContent) {
          const singleSetWidth = tickerContent.scrollWidth / 2;

          // Reset position when we've scrolled past the first set
          if (Math.abs(translateXRef.current) >= singleSetWidth) {
            translateXRef.current = 0;
          }

          tickerContent.style.transform = `translateX(${translateXRef.current}px)`;
        }
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [isPaused],
  );

  useEffect(() => {
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Handlers for Pause/Resume
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (latestData.length === 0) return null;

  return (
    <div
      className="overflow-hidden w-full relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fading Effect */}
      <div
        className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, var(--primary-black), transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, var(--primary-black), transparent)",
        }}
      />

      {/* Main Ticker Content */}
      <div
        ref={tickerContentRef}
        className="flex whitespace-nowrap will-change-transform"
      >
        {extendedData.map((item, i) => (
          <div key={i} className="px-2">
            <NextLink
              href={`/analysis/${item.instrumentCode}`}>
              <NormalChip>
                <div className="size-full px-2.5 py-1 flex items-center gap-2">
                  {/* Ticker Icons */}
                  <div>
                    <PriceChangeIndicator sign={item.sign} />
                  </div>

                  {/* Ticker Texts */}
                  <div>
                    <div className="text-sm font-medium truncate">{item.instrumentCode}</div>
                    <div className="flex items-center gap-1 w-22">
                      <span className="text-xs line-clamp-1">{item.change}</span>
                      <span
                        className={`text-xs line-clamp-1 ${item.sign === 0 ? "text-[var(--quaternary-white)]" : item.sign > 0 ? "text-[var(--tertiary-green)]" : "text-[var(--primary-red)]"}`}
                      >
                        {item.changePercent > 0 ? "+" : ""}
                        {item.changePercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </NormalChip>
            </NextLink>
          </div>
        ))}
      </div>
    </div>
  );
}
