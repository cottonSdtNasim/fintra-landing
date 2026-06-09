"use client";

import { FadeUp } from "../common/animation";
import { Typography } from "../common/Typography";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Link as ButtonLink } from "../common/Link";
import { MdArrowOutward } from "react-icons/md";
import TradeSmarterSection from "./HeroSection/TradeSmarterSection";
import TradeSlider from "./HeroSection/TradeSlider";
import Faq from "./HeroSection/Faq";
import Review from "./HeroSection/Review";
import FeatureFooter from "./HeroSection/FeatureFooter";

export function HeroView() {
  return (
    <>
      <div className=" mx-auto md:p-4 p-2  ">
        <div className="relative  rounded-3xl  min-h-[90vh] text-center overflow-hidden">
          <Image
            src="/heroColWeb.png"
            alt=""
            width={1920}
            height={1080}
            className="w-full h-full object-cover hidden md:block"
          />
          {/* for mobile */}
          <Image
            src="/heroColmob.png"
            alt=""
            width={920}
            height={1080}
            className="w-full h-full object-cover md:hidden block"
          />

          {/* Content */}
          {/* i want more width for mobile */}
          <div className="absolute top-[calc(20%-20px)]  md:left-1/2 md:-translate-x-1/2 z-10 flex flex-col items-center justify-center text-center ">
            {/* Trusted By Pill */}
            <div className="mb-4">
              <div className="flex items-center my-auto gap-x-1 rounded-full border border-border bg-(--white15) py-1 px-2 md:px-4 backdrop-blur-md">
                <div>
                  <Image
                    src="/herop4.png"
                    alt=""
                    width={40}
                    height={40}
                    className="w-auto h-auto"
                  />
                </div>

                <Typography variant="Span1216" className="text-herotext">
                  Trusted By Over 600 Traders All Over Bangladesh
                </Typography>
              </div>
            </div>

            {/* Heading */}
            <Typography variant="h1" className="text-herotext mb-4">
              Invest With Clarity. <br /> Trade With{" "}
              <br className="block md:hidden" />
              Confidence
            </Typography>

            {/* Subtitle */}
            <Typography variant="p" className="text-herotext px-5">
              Empowering Every Investor In Bangladesh&apos;s Capital Market
            </Typography>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-8 md:mt-16 md:w-2/3 w-full px-5">
              <ButtonLink
                href="https://client.fintra.com.bd/login"
                className="w-full text-center justify-center"
              >
                Login <MdArrowOutward className="text-lg " />
              </ButtonLink>
              <ButtonLink
                href="/"
                variant="secondary"
                className="w-full text-center justify-center"
              >
                About us
              </ButtonLink>
            </div>
          </div>

          <FadeUp
            custom={1}
            className="absolute bottom-0 left-0 right-0  w-full md:hidden pointer-events-none"
          >
            <div className="relative w-full aspect-4/5">
              <Image
                src="/heroimagemobile.png"
                alt="Platform Dashboard Mobile"
                fill
                className="object-contain object-bottom w-full h-full"
                priority
              />
            </div>
          </FadeUp>
        </div>
        <FadeUp
          custom={1}
          className="w-full  max-w-[80vw] mx-auto -mt-[calc(50vh-10px)] hidden md:block"
        >
          <div className="relative w-full aspect-3/2">
            <Image
              src="/heroimage.png"
              alt="Platform Dashboard Desktop"
              fill
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </FadeUp>
      </div>
      {/* className="container mx-auto px-4 py-20 relative z-10" */}
      <div className="container mx-auto px-[calc(10vw-3rem)] pt-20 ">
        <TradeSmarterSection />
        <TradeSlider />
        <Faq />
        <Review />
        <FeatureFooter />
      </div>
    </>
  );
}
