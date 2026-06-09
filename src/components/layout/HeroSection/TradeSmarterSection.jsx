"use client";

import Image from "next/image";
import { Card } from "../../common/Card";
import { Typography } from "../../common/Typography";
import { useRawJsSlider } from "../../common/animation";

const cardsData = [
  {
    title: "Advance Charts",
    desc: "A professional workspace that simplifies the most complex technical analysis.",
    image: "/advanceChart.png",
    colSpan: "md:col-span-3",
  },
  {
    title: "Real-Time Updates",
    desc: "Stay ahead of every price movement with zero-latency data directly from the exchange.",
    image: "/realtimeUpdate.png",
    colSpan: "md:col-span-3",
  },
  {
    title: "Trade Now, Settle Later",
    desc: "Instant loans to keep your portfolio moving at full speed.",
    image: "/trade.png",
    colSpan: "md:col-span-2",
  },
  {
    title: "Smart Market Filtering",
    desc: "Discover the next market leader using 50+ professional screening criteria.",
    image: "/smart.png",
    colSpan: "md:col-span-2",
  },
  {
    title: "Instant Transactions",
    desc: "Move your money in and out with secure, lightning-fast banking integrations.",
    image: "/instant.png",
    colSpan: "md:col-span-2",
  },
];

function FeatureCard({ card, className = "" }) {
  return (
    <Card className={`col-span-1 h-full ${className}`}>
      <div className="flex flex-col h-full p-6 rounded-[10px]">
        <div className="flex-1 relative mb-6 rounded-lg overflow-hidden  ">
          <Image
            src={card.image}
            alt={card.title}
            width={500}
            height={500}
            className="object-contain h-auto w-auto"
          />
        </div>
        <div>
          <Typography variant="h4" className="text-(--primary-white) mb-2">
            {card.title}
          </Typography>
          <Typography variant="p" className="text-(--secondary-white)">
            {card.desc}
          </Typography>
        </div>
      </div>
    </Card>
  );
}

export default function TradeSmarterSection() {
  // Use the animation hook for the mobile slider (4 seconds per slide)
  const { activeIndex } = useRawJsSlider(cardsData.length, 4000);

  return (
    <section className=" mb-10 md:mb-20">
      <div className="mb-10 p-4">
        <Typography variant="h2" className="text-center mb-4">
          Everything You Need to Trade Smarter
        </Typography>
        <Typography
          variant="p"
          className="text-center text-(--secondary-white)"
        >
          Powerful tools designed specifically for the Bangladeshi market
        </Typography>
      </div>

      {/* Mobile Slider Container */}
      <div className="md:hidden overflow-hidden w-full relative">
        <div
          className="flex ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transitionDuration: activeIndex === 0 ? "2500ms" : "1000ms",
            transitionProperty: "transform",
          }}
        >
          {cardsData.map((card, index) => (
            <div key={index} className="w-full shrink-0 px-2">
              <FeatureCard card={card} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid Container */}
      <div className="hidden md:grid grid-cols-6 gap-6">
        {cardsData.map((card, index) => (
          <FeatureCard key={index} card={card} className={card.colSpan} />
        ))}
      </div>
    </section>
  );
}
