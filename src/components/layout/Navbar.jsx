"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Link as ButtonLink } from "../common/Link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SlideDownNav, FadeIn, NavUnderline } from "../common/animation";
import { FiMenu, FiX, FiArrowUpRight } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import { HiMenuAlt4 } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";

const nablinks = [
  { href: "/market", label: "Market" },
  {
    href: "/analysis/SQURPHARMA",
    matchPath: "/analysis",
    label: "Analysis",
  },
  { href: "/chart", label: "Chart" },
  { href: "/screener", label: "Screener" },
  { href: "/features", label: "Features" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("/market"); // 1st link initially active
  const [activeMobileNav, setActiveMobileNav] = useState("/market"); // 1st mobile link initially active
  const [hoveredNav, setHoveredNav] = useState(null);

  // Sync active state with URL pathname
  useEffect(() => {
    let currentPath = pathname === "/" ? "/market" : pathname;

    // Find matching link taking matchPath into account
    const matchedLink = nablinks.find(
      (link) =>
        currentPath === link.href ||
        (link.matchPath && currentPath.startsWith(link.matchPath)),
    );

    if (matchedLink) {
      setActiveNav(matchedLink.href);
      setActiveMobileNav(matchedLink.href);
    } else {
      setActiveNav("/market");
      setActiveMobileNav("/market");
    }
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <SlideDownNav className="fixed top-5 md:top-10 left-0 right-0 z-50 w-full pointer-events-none flex justify-center">
        <div className="relative container mx-auto px-4 md:px-8 w-[calc(100%-3rem)] md:w-[calc(100%-5rem)] border border-(--primary-white)/15 bg-(--primary-white)/5 md:bg-transparent backdrop-blur-md rounded-[12px] pointer-events-auto transition-all duration-300">
          <div className="flex h-[51px] md:h-[65px] items-center justify-between">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/Logo.png"
                  alt="Fintra Logo"
                  width={100}
                  height={31}
                  className=" h-[23px] md:h-auto w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Links */}
            <div
              className="hidden items-center gap-8 md:flex h-full"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {nablinks.map((link) => {
                const isHovered = hoveredNav === link.href;
                const isActive = activeNav === link.href && hoveredNav === null;
                const isVisible = isHovered || isActive;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredNav(link.href)}
                    onClick={() => setActiveNav(link.href)}
                    className={`text-(--primary-white) text-[16px] leading-[27px] font-medium transition-colors relative flex items-center h-full px-1 `}
                  >
                    {link.label}
                    <NavUnderline isVisible={isVisible} />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Buttons */}
            <FadeIn className="hidden items-center gap-3 md:flex" delay={0.1}>
              <ButtonLink href="/login" variant="secondary">
                Login
              </ButtonLink>
              <ButtonLink href="/signup">
                Sign Up <MdArrowOutward className="text-lg" />
              </ButtonLink>
            </FadeIn>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="text-(--primary-white) transition-colors relative w-6 h-6 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <FiX className="text-2xl" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <HiMenuAlt4 className="text-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden w-full"
              >
                <div className="flex flex-col items-center gap-4 pb-6 pt-4 border-t border-white/5 mt-1">
                  {nablinks.map((link) => {
                    const isActive = activeMobileNav === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => {
                          setActiveMobileNav(link.href);
                          toggleMenu();
                        }}
                        className={`text-lg transition-colors w-full text-center py-3 rounded-xl relative overflow-hidden border ${
                          isActive
                            ? "text-(--tertiary-green) bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            : "text-white/80 hover:text-white border-transparent"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#b7ff64]/20 to-transparent blur-md pointer-events-none" />
                        )}
                        <span className="relative z-10">{link.label}</span>
                      </Link>
                    );
                  })}

                  <div className="flex flex-col gap-4 w-full mt-2">
                    <ButtonLink
                      href="/login"
                      onClick={toggleMenu}
                      className="w-full text-center py-3.5 rounded-full text-base font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center "
                    >
                      Login
                    </ButtonLink>
                    <ButtonLink
                      href="/signup"
                      onClick={toggleMenu}
                      className="w-full text-center py-3.5 rounded-full text-base font-medium text-black bg-[#b7ff64] hover:bg-[#a3eb50] transition-colors flex items-center justify-center gap-2"
                    >
                      Sign Up <FiArrowUpRight className="text-xl" />
                    </ButtonLink>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SlideDownNav>
    </>
  );
}
