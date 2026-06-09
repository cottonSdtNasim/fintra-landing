import { createElement } from "react";

const baseStyles = {
  h1: "text-[30px] md:text-[50px] leading-[30px] md:leading-[60px] font-[700] ",
  h2: "text-[23px] md:text-[35px] leading-[35px] font-[600]",
  h3: "text-[18px] md:text-[20px] leading-[35px] font-[600]",
  h4: "text-base leading-[35px] font-[500]",
  title:
    "text-[22px] md:text-[28px] leading-[28px] md:leading-[34px] font-[700]",
  heading: "text-[20px] md:text-[22px] leading-[26px] font-[700]",
  subheading: "text-[18px] md:text-[20px] leading-[26px] font-[600]",
  text14: "text-[14px] leading-[20px] font-[400]",
  text12: "text-[12px] leading-[18px] font-[400]",
  text10: "text-[10px] leading-[16px] font-[400]",
  small_cap_black:
    "text-[11px] md:text-[12px] uppercase tracking-[0.08em] leading-[16px] font-[600]",

  p: "text-base leading-[24px] font-[300]  ",

  span: "text-sm md:text-base",
  Span1216:
    "text-[12px] md:text-[16px] leading-[20px] md:leading-[24px] font-[400]  ",
  Span3035: "text-[30px] md:text-[35px] leading-[40px] font-[600]",
  Span1618: "text-[16px] md:text-[18px] leading-[24px] font-[600]",
  Span12: "text-[12px] leading-[18px] font-[400]",
  Span1620: "text-[16px] md:text-[20px] leading-[24px] font-[500]",
  Span9: "text-[10px] leading-[14px] font-[600]",
};

const defaultTags = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  span: "span",
  Span1216: "span",
  Span3035: "span",
  Span1618: "span",
  Span12: "span",
  Span1620: "span",
  Span9: "span",
};

export function Typography({
  variant = "p",
  as,
  children,
  className = "",
  ...props
}) {
  const Component = as || defaultTags[variant] || "p";
  const baseClass = baseStyles[variant] || baseStyles.p;

  return createElement(
    Component,
    {
      className: `${baseClass} ${className}`,
      ...props,
    },
    children,
  );
}
