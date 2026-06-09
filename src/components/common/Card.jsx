"use client";

import { useRef, useState } from "react";

export function Card({
  children,
  className = "",
  interactive = true,
  active = false,
  glowColor = "rgba(183, 255, 100, 0.12)",
  borderGradient = "from-[#3D4646]/60 via-[#3D4646]/30 to-[#3D4646]/5",
  innerClassName = "bg-(--secondary-black)",
  defaultBorder = "bg-linear-to-br from-(--primary-white)/15 via-(--primary-white)/10 to-(--primary-white)/5",
  ...props
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  if (!interactive) {
    return (
      <div
        className={`rounded-[12px] border border-border bg-card text-card-foreground shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  // If active is true, we want the opacity to be 1 persistently.
  const currentOpacity = active ? 1 : opacity;

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[12px] p-px group ${className} `}
      {...props}
    >
      {/* Default Gradient border using mask */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-[12px] ${defaultBorder}`}
        style={{
          padding: "1px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Hover Gradient border using mask */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-[12px] bg-linear-to-br ${borderGradient} transition duration-500 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{
          padding: "1px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Inner Card content container */}
      <div
        className={`relative h-full w-full rounded-[11px] text-white overflow-hidden ${innerClassName}`}
      >
        {/* Children content z-index relative to glow */}
        <div className="relative z-10 h-full">{children}</div>
        {/* Mouse Hover Tracker Glow */}
        <div
          className="pointer-events-none absolute -inset-px transition duration-300 z-20"
          style={{
            opacity: currentOpacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
          }}
        />
      </div>
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }) {
  return (
    <h3
      className={`font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-6 pt-0 h-full ${className}`} {...props}>
      {children}
    </div>
  );
}
