"use client";

import { motion } from "framer-motion";

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  width = "auto",
  layoutScopeId = "main_tab",
}) {
  return (
    <div className="w-full relative mb-4">
      {/* Scrollable Container */}
      <div className="flex items-center gap-6 md:gap-8 overflow-x-auto border-b border-(--primary-white)/10 w-full pb-px [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative py-4 text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap outline-none group cursor-pointer ${width} ${
                isActive
                  ? "text-(--tertiary-green)"
                  : "text-(--primary-white)/60 hover:text-(--primary-white) hover:scale-105 "
              }`}
            >
              <span className="relative z-10">{tab.label}</span>

              {/* Active Underline */}
              {isActive && (
                <motion.div
                  layoutId={layoutScopeId}
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-(--tertiary-green) z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
