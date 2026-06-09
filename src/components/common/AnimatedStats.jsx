"use client";

import { useEffect, useRef } from "react";
import { countUp, observeAndFadeIn } from "../common/animation";
import { useLanguageStore } from "../../stores/useLanguageStore";

const STATS = [
  { value: 12500, labelKey: "stats_users", suffix: "+" },
  { value: 48, labelKey: "stats_markets", suffix: "" },
];

export function AnimatedStats() {
  const t = useLanguageStore((s) => s.t);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const unobserveFade = observeAndFadeIn("[data-stat-card]", {
      duration: 500,
      fromY: 12,
    });

    const valueEls = container.querySelectorAll("[data-stat-value]");
    const cleanups = [];

    const valueObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.target ?? 0);
          const decimals = Number(el.dataset.decimals ?? 0);
          const suffix = el.dataset.suffix ?? "";
          cleanups.push(countUp(el, target, { decimals, suffix }));
          valueObserver.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );

    valueEls.forEach((el) => valueObserver.observe(el));

    return () => {
      unobserveFade();
      valueObserver.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid w-full max-w-2xl grid-cols-2 gap-6 pt-4"
    >
      {STATS.map((stat) => (
        <div
          key={stat.labelKey}
          data-stat-card
          className="rounded-xl border border-border bg-card/60 px-6 py-5 text-center opacity-0"
        >
          <p
            data-stat-value
            data-target={stat.value}
            data-decimals={0}
            data-suffix={stat.suffix}
            className="text-3xl font-bold text-primary"
          >
            0{stat.suffix}
          </p>
          <p className="mt-1 text-sm text-foreground/70">{t[stat.labelKey]}</p>
        </div>
      ))}
    </div>
  );
}
