"use client";

import Image from "next/image";
import { Typography } from "../../common/Typography";
import { Card } from "../../common/Card";
import { useDirectionalSlider } from "../../common/animation";
import { FiArrowUpRight } from "react-icons/fi";
import { Link as ButtonLink } from "../../common/Link";
import { MdArrowOutward } from "react-icons/md";
import {
  TbStar,
  TbStarFilled,
  TbStarHalf,
  TbStarHalfFilled,
} from "react-icons/tb";

const reviews = [
  {
    id: 1,
    title: "The edge I was looking for.",
    text: "“The Instant Cash feature is a total game-changer. I used to miss out on market dips while waiting for my T+2 settlement, but now I’m always ready to buy. It’s the most seamless trading experience I’ve had in years.”",
    name: "Ariful Haque",
    role: "Full-Time Trader",
    rating: 5,
  },
  {
    id: 2,
    title: "Finally!",
    text: "“I’ve tried almost every broker app in Bangladesh, and they all lag when the market gets volatile. Fintra’s feed is the only one that stays synced with the DSE microsecond by microsecond. Fintra+ paid for itself in my first week.”",
    name: "Sarah Karim",
    role: "Investment Analyst",
    rating: 2.5,
  },
  {
    id: 3,
    title: "Institutional tools for retail traders.",
    text: "“The advanced screeners and heatmaps are incredible. I can sift through the entire market in seconds to find high-alpha stocks. It’s like having a Bloomberg terminal right in my pocket.”",
    name: "Tanvir Ahmed",
    role: "Tech Lead & Part-time Investor",
    rating: 4.5,
  },
];

export default function Review() {
  const { sliderStyle } = useDirectionalSlider(reviews.length, 5000);

  return (
    <section className=" mb-10 md:mb-20 p-4 md:p-0">
      <div className="relative">
        {/* Background Images */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <Image
            src="/cusRevWeb.png"
            alt="Background"
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="absolute inset-0 z-0 md:hidden">
          <Image
            src="/cusRevmob.png"
            alt="Background"
            fill
            className="object-cover rounded-xl"
          />
        </div>

        {/* Content */}
        <div className=" p-6 md:p-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 items-center">
          {/* Left Side: Text */}
          <div className="flex flex-col mb-12 md:mb-0">
            <Typography
              variant="Span3035"
              className="text-(--primary-white) mb-6 "
            >
              Elevate Your Strategy <br className="hidden lg:block" />
              Dominate The Market
            </Typography>
            <Typography
              variant="p"
              className="text-white/70 mb-10 text-lg max-w-lg"
            >
              Stop trading in the dark. Join thousands of elite investors using
              Fintra to outpace the market with real-time data, instant
              liquidity, and institutional-grade insights. Your next big move
              starts here.
            </Typography>

            <div>
              {/* <button className="flex items-center gap-2 bg-[#b7ff64] text-[#040a08] px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity text-lg">
              Start My Journey <FiArrowUpRight size={24} />
            </button> */}
              <ButtonLink
                href="https://client.fintra.com.bd/login"
                className="w-full md:w-1/2 text-center justify-center"
              >
                Start My Journey <MdArrowOutward className="text-lg " />
              </ButtonLink>
            </div>
          </div>

          {/* Right Side: Slider */}
          {/* We use a fixed height container to ensure slides are exactly 100% of the box */}
          <div className="relative w-full h-[400px] md:h-auto overflow-hidden rounded-[12px]">
            <div
              className="flex flex-col md:flex-row w-full h-full"
              style={sliderStyle}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full h-full shrink-0 p-4">
                  <Card
                    interactive={true}
                    className="h-full"
                    innerClassName="flex flex-col p-8 justify-between bg-transparent"
                    defaultBorder="bg-linear-to-tr from-[#b7ff64]/60 via-[#b7ff64]/10 to-[#b7ff64]/5"
                  >
                    <div>
                      <div className="flex justify-between items-center ">
                        <Typography
                          variant="p"
                          className="text-(--primary-white) font-medium"
                        >
                          {review.title}
                        </Typography>
                        {/* Dynamic Stars */}
                        <div className="flex gap-1 text-[#F5B800] text-sm md:text-base">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            if (review.rating >= starValue) {
                              return <TbStarFilled key={i} />;
                            } else if (review.rating >= starValue - 0.5) {
                              return <TbStarHalfFilled key={i} />;
                            } else {
                              return <TbStar key={i} />;
                            }
                          })}
                        </div>
                      </div>
                      <Typography
                        variant="p"
                        className="text-(--primary-white) py-2 md:py-5"
                      >
                        {review.text}
                      </Typography>
                    </div>
                    <div>
                      <Typography
                        variant="p"
                        className="text-(--primary-white) font-semibold"
                      >
                        {review.name}
                      </Typography>
                      <Typography
                        variant="p"
                        className="text-(--primary-white) font-normal italic"
                      >
                        {review.role}
                      </Typography>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
