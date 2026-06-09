"use client";

import { useState } from "react";
import { Typography } from "../../common/Typography";
import { Card } from "../../common/Card";
import { ExpandCollapse } from "../../common/animation";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const faqs = [
  {
    question: "What is Fintra and how does it give me an advantage?",
    answer:
      "Fintra is a high-performance trading ecosystem that equips you with institutional-grade tools, real-time data, and expert research to master the market with confidence.",
  },
  {
    question: "Is the market data truly real-time?",
    answer:
      "Absolutely. We utilize industry-leading encryption and multi-factor authentication to ensure your data, trades, and capital remain protected under bank-grade security protocols.",
  },
  {
    question: "Is my trading data and capital secure with Fintra?",
    answer:
      "We use bank-level encryption and advanced security protocols to keep your data and funds completely safe. Two-factor authentication adds an extra layer of protection.",
  },
  {
    question: "How do I update my official BO Account details?",
    answer:
      "For your security and regulatory compliance, BO account changes cannot be made in-app. Please visit our office in person or contact our support team to initiate an update.",
  },
  {
    question: "How does the 'Instant Cash' feature work?",
    answer:
      "Instant Cash provides immediate liquidity against your pending sales, allowing you to seize new market opportunities instantly without waiting for the standard T+2 settlement cycle.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mb-10 md:mb-20">
      <div className="mb-10 p-4">
        <Typography variant="h2" className="text-center mb-4">
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="p"
          className="text-center text-(--secondary-white)"
        >
          You have questions? We have the answers
        </Typography>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-4 max-w-full mx-auto">
        {faqs.map((faq, index) => {
          const isActive = openIndex === index;
          return (
            <Card
              key={index}
              interactive={true}
              active={isActive}
              glowColor={
                isActive
                  ? "rgba(183, 255, 100, 0.12)"
                  : "rgba(255, 255, 255, 0.05)"
              }
              borderGradient={
                isActive
                  ? "from-[#3D4646]/60 via-[#3D4646]/30 to-[#3D4646]/5"
                  : "from-white/20 via-white/5 to-white/20"
              }
              className="cursor-pointer"
              onClick={() => setOpenIndex(isActive ? -1 : index)}
            >
              <div className="p-6 flex flex-col">
                <div className="flex justify-between items-center ">
                  <Typography variant="h4" className="text-(--primary-white)">
                    {faq.question}
                  </Typography>
                  <span className="text-(--primary-white) ml-4 shrink-0 text-sm ">
                    {isActive ? (
                      <TiArrowSortedUp size={24} />
                    ) : (
                      <TiArrowSortedDown size={24} />
                    )}
                  </span>
                </div>
                <ExpandCollapse
                  isVisible={isActive}
                  className="overflow-hidden"
                >
                  <Typography variant="p" className="text-(--secondary-white)">
                    {faq.answer}
                  </Typography>
                </ExpandCollapse>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
