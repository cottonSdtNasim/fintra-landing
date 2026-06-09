"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top to ensure skeleton is viewed from top
    window.scrollTo(0, 0);
    
    setLoading(true);
    
    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative w-full min-h-[calc(100vh-200px)]">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 z-10 w-full pt-20 mt-20 px-4 lg:px-[calc(10vw-3rem)] container mx-auto flex flex-col gap-6"
          >
            {/* Top skeleton bar (search/header) */}
            <div className="relative overflow-hidden w-full h-[60px] bg-white/5 rounded-xl border border-white/5">
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>
            {/* Main content skeleton */}
            <div className="relative overflow-hidden w-full h-[600px] bg-white/5 rounded-xl border border-white/5">
              <div
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                style={{ animationDelay: "0.15s" }}
              ></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
