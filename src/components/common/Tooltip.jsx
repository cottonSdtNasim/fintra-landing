import React, { useState, useRef, useLayoutEffect } from "react";
import { Typography } from "./Typography";

const GAP = 6;
const MAX_WIDTH = "min(280px, calc(100vw - 32px))";

const placementClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

export default function Tooltip({
  content,
  children,
  placement = "top",
  className = "",
}) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    if (!visible || !wrapperRef.current || !tooltipRef.current) {
      setPosition(null);
      return;
    }
    const trigger = wrapperRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const placements = {
      top: {
        x: trigger.left + trigger.width / 2 - tooltip.width / 2,
        y: trigger.top - tooltip.height - GAP,
      },
      bottom: {
        x: trigger.left + trigger.width / 2 - tooltip.width / 2,
        y: trigger.bottom + GAP,
      },
      left: {
        x: trigger.left - tooltip.width - GAP,
        y: trigger.top + trigger.height / 2 - tooltip.height / 2,
      },
      right: {
        x: trigger.right + GAP,
        y: trigger.top + trigger.height / 2 - tooltip.height / 2,
      },
    };
    let { x, y } = placements[placement];

    if (x < 0) x = 0;
    if (x + tooltip.width > vw) x = vw - tooltip.width;
    if (y < 0) y = GAP;
    if (y + tooltip.height > vh) y = vh - tooltip.height - GAP;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    setPosition({
      left: x - wrapperRect.left,
      top: y - wrapperRect.top,
    });
  }, [visible, placement]);

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 rounded-md border border-(--tertiary-green) bg-(--tertiary-green) text-black px-2 py-1.5 shadow-lg whitespace-normal ${position ? "" : placementClasses[placement]}`}
          style={{
            boxShadow: "0px 4px 6px rgba(35, 31, 32, 0.3)",
            maxWidth: MAX_WIDTH,
            width: "max-content",
            ...(position && {
              left: position.left,
              top: position.top,
              margin: 0,
              transform: "none",
            }),
          }}
        >
          {typeof content === "string" ? (
            <Typography variant="text12">{content}</Typography>
          ) : (
            content
          )}
        </div>
      )}
    </div>
  );
}
