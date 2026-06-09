// import AdvanceTradingView from "./AdvanceTradingView/index.jsx";
import { Typography } from "../../common/Typography";
import Tooltip from "../../common/Tooltip";
import { GoQuestion } from "react-icons/go";
import LatestUpdate from "./LatestUpdate";
import CompanyStatistic from "./CompanyStatistic";
import { useLanguageStore } from "../../../stores/useLanguageStore.js";
import AdvanceTradingView from "../AdvanceTradingView/index.jsx";
import NormalCard from "../../common/NormalCard.jsx";

const LATEST_UPDATE_TOOLTIP_TEXT = "Latest Update";
const BULLS_SAY_TOOLTIP_TEXT = "Bulls Say";

function format2Decimals(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return val ?? "—";
  return n.toFixed(2);
}

export default function OverviewTab({
  instrumentCode,
  companyInfo,
  companyLatestNews,
}) {
  const t = useLanguageStore((s) => s.t);

  return (
    <>
      <NormalCard>
        <div className="p-2 h-[calc(100vh-200px)]">
          <AdvanceTradingView instrumentCode={instrumentCode} />
        </div>
      </NormalCard>

      {/* grid cols 1:3 */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 my-4">
        <div className="flex flex-col border border-light_border_color bg-cus_white_color rounded-lg p-2 ">
          <div className="flex items-center space-x-2 mb-2">
            <Typography variant="text14" className="">
              {t["companyDetails.aboutCompany.title"]}
            </Typography>
            <Tooltip content={t["companyDetails.aboutCompany.tooltip"]} placement="top">
              <GoQuestion
                className="cursor-help text-light_gray_text_color hover:text-light_black_color shrink-0"
                size={16}
              />
            </Tooltip>
          </div>
          {/* <Typography variant='text12' className="text-light_gray_text_color">
                    INSTRUMENT_CODE: {instrumentCode ?? '—'}
                </Typography> */}
          <Typography variant="text12">
            {companyInfo?.company_details ?? "—"}
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 pt-2">
            <Typography
              variant="text10"
              className="flex flex-col items-start gap-y-2"
            >
              <span className="text-light_green_gunMetal_color font-semibold">
                TOTAL TRADES:
              </span>{" "}
              <span className="font-bold text-sm">
                {companyInfo?.TOTAL_TRADES ?? "—"}
              </span>
            </Typography>
            <Typography
              variant="text10"
              className="flex flex-col items-start gap-y-2"
            >
              <span className="text-light_green_gunMetal_color font-semibold">
                TOTAL VOLUME:
              </span>{" "}
              <span className="font-bold text-sm">
                {companyInfo?.TOTAL_VOLUME ?? "—"}
              </span>
            </Typography>
            <Typography
              variant="text10"
              className="flex flex-col items-start gap-y-2"
            >
              <span className="text-light_green_gunMetal_color font-semibold">
                TOTAL VALUE:
              </span>{" "}
              <span className="font-bold text-sm">
                {format2Decimals(companyInfo?.TOTAL_VALUE)} Million BDT.
              </span>
            </Typography>
            <Typography
              variant="text10"
              className="flex flex-col items-start gap-y-2"
            >
              <span className="text-light_green_gunMetal_color font-semibold">
                LTP
              </span>{" "}
              <span className="font-bold text-sm">
                {format2Decimals(companyInfo?.LAST_TRADED_PRICE)}
              </span>
            </Typography>
          </div>
        </div>
        {/* latest update */}
        <div className="border border-light_border_color flex flex-col bg-cus_white_color rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <Typography variant="text14" className="">
              {t["companyDetails.latestUpdate.title"]}
            </Typography>
            <Tooltip content={t["companyDetails.latestUpdate.tooltip"]} placement="top">
              <GoQuestion
                className="cursor-help text-light_gray_text_color hover:text-light_black_color shrink-0"
                size={16}
              />
            </Tooltip>
          </div>
          <div className="h-[calc(20vh+100px)] min-h-0 overflow-y-auto scrollbar-thin">
            <div className="mt-2 flex-1 min-h-0 overflow-hidden">
              <LatestUpdate companyLatestNews={companyLatestNews} />
            </div>
          </div>
        </div>
      </div>
      <CompanyStatistic />
    </>
  );
}

{
  /* bulls say */
}
{
  /* <div className='flex flex-col border border-light_border_color bg-cus_white_color rounded-lg p-2 '>
                    <div className='flex items-center space-x-2'>
                        <Typography variant='text14' className=''>Bulls Say</Typography>
                        <Tooltip content={BULLS_SAY_TOOLTIP_TEXT} placement="top">
                            <GoQuestion className="cursor-help text-light_gray_text_color hover:text-light_black_color shrink-0" size={16} />
                        </Tooltip>
                    </div>
                </div> */
}
