"use client";

import Image from "next/image";
import { Typography } from "../../common/Typography";
import { useRawJsSlider, FadeInUp } from "../../common/animation";
import Link from "next/link";
import { Card } from "../../common/Card";

const tabs = [
  {
    id: "trade_fast",
    title: "Trade Fast, Trade Easy",
    description:
      "Master the market with a high-velocity interface built for decisive action.",
    image: "/TradeFast.png",
  },
  {
    id: "instant_portfolio",
    title: "Instant Portfolio Insights",
    description:
      "Transform raw data into clarity with real-time analytics of your wealth's performance.",
    image: "/InstantPortfolio.png",
  },
  {
    id: "track_stocks",
    title: "Track Your Favorite Stocks",
    description:
      "Keep a close eye on your preferred stocks with custom watchlists and instant alerts.",
    image: "/TrackStore.png",
  },
  {
    id: "trading_hub",
    title: "Your Trading Hub At A Glance",
    description:
      "Everything you need to make informed decisions, organized in one comprehensive dashboard.",
    image: "/Tradinghub.png",
  },
];

export default function TradeSlider({ className = "" }) {
  const {
    activeIndex: activeTab,
    progress,
    handleTabClick,
  } = useRawJsSlider(tabs.length, 5000);

  return (
    <section className="mb-10 md:mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end my-auto gap-6 mb-12 ">
        <div className="p-4 md:p-0">
          <Typography
            variant="h2"
            className="text-(--primary-white) mb-4 text-center md:text-start"
          >
            Trade Anywhere, Anytime.
          </Typography>
          <Typography
            variant="p"
            className="text-(--secondary-white) text-center md:text-start"
          >
            Download the Fintra mobile app for iOS and Android
          </Typography>
        </div>
        <div className="flex items-center gap-x-4 mx-auto md:mx-0  md:my-auto">
          <Link
            href="https://play.google.com/store/apps/details?id=bd.com.fintra.omsapp&hl=en"
            target="_blank"
          >
            <Image
              src="/playStore.png"
              alt="Get it on Google Play"
              width={140}
              height={42}
              className="cursor-pointer hover:scale-[1.05] transition-all duration-300"
            />
          </Link>

          <Link
            href="https://apps.apple.com/us/app/fintra/id6758080450"
            target="_blank"
          >
            <Image
              src="/appStore.png"
              alt="Download on the App Store"
              width={140}
              height={42}
              className="cursor-pointer hover:scale-[1.05] transition-all duration-300"
            />
          </Link>
        </div>
      </div>

      {/* Desktop View (JS Progress Animation) */}
      <div className="hidden md:grid grid-cols-2 gap-y-6 gap-x-12 items-center min-h-[480px] ">
        {/* Tabs List */}
        <div className=" flex flex-col justify-center overflow-hidden  h-[calc(100vh-200px)]">
          {tabs.map((tab, index) => {
            const isActive = index === activeTab;
            return (
              <div
                key={tab.id}
                onClick={() => handleTabClick(index)}
                className={`cursor-pointer py-6 border-t border-(--forth-green) relative transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                {/* Active Progress Border */}
                {isActive && (
                  <div
                    className="absolute -top-px left-0 h-[2px] bg-(--primary-white) transition-all ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <Typography variant="h3" className="text-(--primary-white) ">
                  {tab.title}
                </Typography>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isActive
                      ? "max-h-[100px] opacity-100 "
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Typography variant="p" className="text-(--secondary-white)">
                    {tab.description}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
        {/* Active Image */}
        <Card className={`h-full w-full relative overflow-hidden ${className}`}>
          {/* Card Background */}
          <FadeInUp
            key={activeTab}
            duration={3}
            className="absolute inset-0 z-10 flex items-end justify-center"
          >
            {/* Image Container */}
            <div className="relative w-[75%] h-[105%] mb-[-10%]">
              <Image
                src={tabs[activeTab].image}
                alt={tabs[activeTab].title}
                fill
                className="object-cover object-top "
                priority
              />
            </div>
          </FadeInUp>

          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-full bg-linear-to-tl from-[#070e0c] via-[#070e0c]/50 to-transparent z-20 pointer-events-none" />
        </Card>
      </div>

      {/* Mobile View (Auto Slide with Sliding Indicator Border) */}
      <div className="md:hidden p-4">
        <div className="flex flex-col">
          {/* Sliding Indicator Border */}
          <div className="relative h-[2px] w-full  bg-(--forth-green) mb-6">
            <div
              className="absolute top-0 left-0 h-full bg-(--primary-white) transition-transform duration-500 ease-in-out"
              style={{
                width: `${100 / tabs.length}%`,
                transform: `translateX(${activeTab * 100}%)`,
              }}
            />
          </div>

          {/* Active Tab Info */}
          <div>
            <Typography variant="h3" className="text-(--primary-white)">
              {tabs[activeTab].title}
            </Typography>
            <Typography variant="p" className="text-(--secondary-white)  mb-6">
              {tabs[activeTab].description}
            </Typography>
          </div>

          {/* Active Image (Mobile) */}
          <Card className="relative w-full aspect-4/5 overflow-hidden">
            <FadeInUp
              key={activeTab}
              duration={3}
              className="absolute inset-0 z-10 flex items-end justify-center"
            >
              {/* Image Container */}
              <div className="relative w-[85%] h-[105%] mb-[-30%]">
                <Image
                  src={tabs[activeTab].image}
                  alt={tabs[activeTab].title}
                  fill
                  className="object-cover object-top "
                  priority
                />
              </div>
            </FadeInUp>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-full bg-linear-to-tl from-[#070e0c] via-[#070e0c]/50 to-transparent z-20 pointer-events-none" />
          </Card>
        </div>
      </div>
    </section>
  );
}
