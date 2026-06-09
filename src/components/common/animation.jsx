"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Vanilla JS Animations ---
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export function fadeInElement(element, options = {}) {
  const { duration = 600, delay = 0, fromOpacity = 0, fromY = 16 } = options;

  element.classList.remove("opacity-0");
  const startOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
  const startTransform = getComputedStyle(element).transform;
  let rafId = 0;
  let startTime = null;

  element.style.opacity = String(fromOpacity);
  element.style.transform = `translateY(${fromY}px)`;

  const animate = (timestamp) => {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime - delay;

    if (elapsed < 0) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    element.style.opacity = String(
      fromOpacity + (startOpacity - fromOpacity) * eased,
    );
    element.style.transform = `translateY(${fromY * (1 - eased)}px)`;

    if (progress < 1) {
      rafId = requestAnimationFrame(animate);
    } else {
      element.style.opacity = "";
      element.style.transform = startTransform === "none" ? "" : startTransform;
    }
  };

  rafId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(rafId);
}

export function countUp(element, target, options = {}) {
  const {
    duration = 1200,
    decimals = 0,
    suffix = "",
    easing = easeOutCubic,
  } = options;
  let rafId = 0;
  let startTime = null;

  const animate = (timestamp) => {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = target * easing(progress);
    element.textContent = `${value.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      rafId = requestAnimationFrame(animate);
    } else {
      element.textContent = `${target.toFixed(decimals)}${suffix}`;
    }
  };

  rafId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(rafId);
}

export function observeAndFadeIn(selector, options) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        cleanups.push(fadeInElement(el, options));
        observer.unobserve(el);
      });
    },
    { threshold: 0.15 },
  );

  elements.forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
    cleanups.forEach((cleanup) => cleanup());
  };
}

// --- Framer Motion Components ---

// Used in HeroView
const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export function FadeUp({ children, custom, className }) {
  return (
    <motion.div
      custom={custom}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Used in Navbar (Slide down)
export function SlideDownNav({ children, className }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.nav>
  );
}

// Used in Navbar (Fade In)
export function FadeIn({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// Used in PageView (Fade In Up)
export function FadeInUp({ children, className, duration = 0.45 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Raw JS Animation Hook for sliders
export function useRawJsSlider(itemCount, duration = 5000) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const INTERVAL = 50; // Update every 50ms for smooth 20fps progress

  useEffect(() => {
    let currentProgress = progress;
    const timer = setInterval(() => {
      currentProgress += (INTERVAL / duration) * 100;
      if (currentProgress >= 100) {
        currentProgress = 0;
        setActiveIndex((prev) => (prev + 1) % itemCount);
      }
      setProgress(currentProgress);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [itemCount, duration, activeIndex]);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    setProgress(0);
  };

  return { activeIndex, progress, handleTabClick };
}

// Used in PageView (Scale In)
export function ScaleIn({ children, delay = 0.15, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Directional Slider Hook for responsive sliding (X on desktop, Y on mobile)
export function useDirectionalSlider(itemCount, duration = 5000) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    // Initial check
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemCount);
    }, duration);
    return () => clearInterval(timer);
  }, [itemCount, duration]);

  const sliderStyle = {
    transform: isMobile
      ? `translateY(-${activeIndex * 100}%)`
      : `translateX(-${activeIndex * 100}%)`,
    transition: "transform 0.7s ease-in-out",
  };

  return { activeIndex, sliderStyle, setActiveIndex };
}

export function NavUnderline({
  isVisible,
  layoutId = "desktop-nav-underline",
}) {
  if (!isVisible) return null;
  return (
    <motion.div
      layoutId={layoutId}
      className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#b7ff64] z-10"
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
}

// Used for Accordions/Faqs
export function ExpandCollapse({ isVisible, children, className }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ height: "auto", opacity: 1, marginTop: 16 }}
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
