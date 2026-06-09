"use client";

import { Typography } from "../common/Typography";
import { FaArrowUp } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className=" bg-(--tertiary-green) py-5">
      <div className="container mx-auto px-[calc(10vw-3rem)] ">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <Typography
            variant="Span1618"
            className="font-medium leaading-[27px] text-black"
          >
            © 2026 Fintra Securities Ltd. All Rights Reserved.
          </Typography>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-row space-x-2 items-center my-auto font-medium leaading-[27px] text-black bg-(--fifth-green) rounded-full px-6 py-2 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <Typography variant="Span1618">Jump to top</Typography>{" "}
            <div>
              <FaArrowUp />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
