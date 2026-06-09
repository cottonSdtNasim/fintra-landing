import NextLink from "next/link";

const baseStyle =
  "px-6 py-2 rounded-full  flex items-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer ";

const variants = {
  primary: "bg-(--tertiary-green) text-black ",
  secondary: "bg-(--primary-white)/10 text-white",
  outline: "border border-border bg-transparent hover:bg-card text-foreground",
  ghost: "hover:bg-card hover:text-foreground text-foreground",
};

const sizes = {
  sm: "text-[16px] font-[500]",
  md: "text-[18px] font-[500]",
  //   lg: "h-11 px-8 text-lg",
};

export function Link({
  href,
  children,
  variant = "primary",
  size = "sm",
  className = "",
  ...props
}) {
  return (
    <NextLink
      href={href}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </NextLink>
  );
}
