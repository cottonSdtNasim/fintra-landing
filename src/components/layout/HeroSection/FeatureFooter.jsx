"use client";
import Link from "next/link";
import { Link as ButtonLink } from "../../common/Link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Typography } from "../../common/Typography";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./Leaflet"), { ssr: false });
export default function Faq() {
  return (
    <section className="mb-10 md:mb-20 p-4 md:p-0">
      <div className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr_1fr_2fr] gap-4">
        <div className="flex flex-col  ">
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
          <Typography variant="p" className="my-5 text-(--secondary-white)">
            Redefining the trading experience for the modern investor. Precision
            tools, institutional intelligence, and the speed you need to
            dominate the market.
          </Typography>
          <div className="flex flex-row items-center space-x-5">
            <Link
              href="https://play.google.com/store/apps/details?id=bd.com.fintra.omsapp&hl=en"
              target="_blank"
            >
              <Image
                src="/playStore.png"
                alt="Get it on Google Play"
                width={140}
                height={42}
                className="cursor-pointer hover:scale-[1.05] transition-all duration-300"
              />
            </Link>

            <Link
              href="https://apps.apple.com/us/app/fintra/id6758080450"
              target="_blank"
            >
              <Image
                src="/appStore.png"
                alt="Download on the App Store"
                width={140}
                height={42}
                className="cursor-pointer hover:scale-[1.05] transition-all duration-300"
              />
            </Link>
          </div>
          <div className=" md:mt-8 mt-4">
            <Typography variant="Span1618" className="font-bold leading-[27px]">
              Follow our market updates
            </Typography>
            <div className="flex flex-row items-center space-x-5 mt-2">
              <Link
                href="https://www.facebook.com/FINTRA.SECURITIES/"
                target="_blank"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.9998 12.4226C24.9705 10.0259 24.2612 7.68743 22.9552 5.68271C21.6492 3.67798 19.8012 2.09045 17.6286 1.10711C15.4559 0.123764 13.0493 -0.21444 10.692 0.132301C8.33482 0.479059 6.12512 1.49631 4.32324 3.06431C2.52134 4.6323 1.20229 6.68571 0.521408 8.98271C-0.159455 11.2797 -0.173799 13.7246 0.480094 16.0295C1.13399 18.3345 2.42887 20.4033 4.21225 21.9926C5.99562 23.5819 8.19319 24.6254 10.5462 25V16.0858H7.42116V12.4226H10.5462V9.63993C10.4739 8.99293 10.5436 8.33779 10.7504 7.72079C10.9573 7.10382 11.2962 6.54004 11.7433 6.06926C12.1904 5.59846 12.7346 5.23213 13.3377 4.99613C13.9409 4.76011 14.5882 4.66017 15.2338 4.70338C16.1711 4.71629 17.1061 4.80038 18.0308 4.95492V8.09929H16.4683C16.1989 8.06507 15.9252 8.09221 15.6676 8.17871C15.41 8.26529 15.175 8.40893 14.98 8.59907C14.785 8.78921 14.635 9.02107 14.541 9.27736C14.447 9.53379 14.4115 9.80814 14.437 10.0801V12.4541H17.9058L17.3433 16.1173H14.4526V24.9214C17.4057 24.4515 20.0936 22.9321 22.0286 20.639C23.9637 18.3458 25.0177 15.4309 24.9998 12.4226Z"
                    fill="white"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/fintrabd?igsh=MThiaWVxeXI1azliYw=="
                target="_blank"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 14.6973C13.7109 14.6973 14.7021 13.7109 14.7021 12.4951C14.7021 12.0166 14.5459 11.5723 14.2871 11.2109C13.8867 10.6592 13.2373 10.293 12.5049 10.293C11.7725 10.293 11.123 10.6543 10.7227 11.2109C10.4639 11.5723 10.3076 12.0166 10.3076 12.4951C10.3027 13.7109 11.2891 14.6973 12.5 14.6973Z"
                    fill="white"
                  />
                  <path
                    d="M17.3047 9.80957V7.69043H17.0312L15.1855 7.69531L15.1953 9.81445L17.3047 9.80957Z"
                    fill="white"
                  />
                  <path
                    d="M15.918 12.5C15.918 14.3848 14.3848 15.918 12.5 15.918C10.6152 15.918 9.08203 14.3848 9.08203 12.5C9.08203 12.0459 9.1748 11.6113 9.33594 11.2158H7.4707V16.333C7.4707 16.9922 8.00781 17.5293 8.66699 17.5293H16.333C16.9922 17.5293 17.5293 16.9922 17.5293 16.333V11.2158H15.6641C15.8301 11.6113 15.918 12.0459 15.918 12.5Z"
                    fill="white"
                  />
                  <path
                    d="M12.5 0C5.5957 0 0 5.5957 0 12.5C0 19.4043 5.5957 25 12.5 25C19.4043 25 25 19.4043 25 12.5C25 5.5957 19.4043 0 12.5 0ZM18.75 16.333C18.75 17.666 17.666 18.75 16.333 18.75H8.66699C7.33398 18.75 6.25 17.666 6.25 16.333V8.66211C6.25 7.3291 7.33398 6.24512 8.66699 6.24512H16.333C17.666 6.24512 18.75 7.3291 18.75 8.66211V16.333Z"
                    fill="white"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/fintrabd/"
                target="_blank"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 0C5.5957 0 0 5.5957 0 12.5C0 19.4043 5.5957 25 12.5 25C19.4043 25 25 19.4043 25 12.5C25 5.5957 19.4043 0 12.5 0ZM9.00391 17.7295H6.56738V9.93164H9.00391V17.7295ZM7.71973 8.95508H7.7002C6.81641 8.95508 6.24512 8.35938 6.24512 7.60254C6.24512 6.83106 6.83594 6.25 7.73437 6.25C8.63281 6.25 9.18457 6.83106 9.2041 7.60254C9.20898 8.35449 8.6377 8.95508 7.71973 8.95508ZM18.75 17.7295H15.9863V13.6963C15.9863 12.6416 15.5566 11.9189 14.6045 11.9189C13.877 11.9189 13.4717 12.4072 13.2861 12.876C13.2178 13.042 13.2275 13.2764 13.2275 13.5156V17.7295H10.4883C10.4883 17.7295 10.5225 10.5811 10.4883 9.93164H13.2275V11.1572C13.3887 10.6201 14.2627 9.8584 15.6592 9.8584C17.3926 9.8584 18.75 10.9814 18.75 13.3936V17.7295Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col    md:mx-auto ">
          <Typography
            variant="p"
            className="text-(--quaternary-white) font-medium leading-[14px] mb-2"
          >
            Company
          </Typography>
          <Typography
            variant="p"
            className="font-medium hover:scale-[1.05] transition-all duration-300"
          >
            <Link href="/" target="_blank">
              About Fintra
            </Link>
          </Typography>
          <Typography
            variant="p"
            className="font-medium hover:scale-[1.05] transition-all duration-300"
          >
            <Link href="/" target="_blank">
              Career
            </Link>
          </Typography>
          <Typography
            variant="p"
            className="font-medium hover:scale-[1.05] transition-all duration-300"
          >
            <Link href="/" target="_blank">
              Contact Support
            </Link>
          </Typography>
        </div>
        <div className="flex flex-col    md:mx-auto ">
          <Typography
            variant="p"
            className="text-(--quaternary-white) font-medium leading-[14px] mb-2"
          >
            Company
          </Typography>
          <Typography
            variant="p"
            className="font-medium hover:scale-[1.05] transition-all duration-300"
          >
            <Link href="/privacy-policy" target="_blank">
              Privacy Policy
            </Link>
          </Typography>
          <Typography
            variant="p"
            className="font-medium hover:scale-[1.05] transition-all duration-300"
          >
            <Link href="/term-of-service" target="_blank">
              Terms Of Service
            </Link>
          </Typography>
          <Typography
            variant="p"
            className="font-medium hover:scale-[1.05] transition-all duration-300"
          >
            <Link href="/" target="_blank">
              Risk Disclosure
            </Link>
          </Typography>
          <Typography
            variant="p"
            className="font-medium hover:scale-[1.05] transition-all duration-300"
          >
            <Link href="/" target="_blank">
              Refund Policy
            </Link>
          </Typography>
        </div>

        <div className="">
          <Typography variant="Span1618" className="font-bold">
            Visit Our Office
          </Typography>
          <div>
            <LeafletMap />
          </div>
        </div>
      </div>
    </section>
  );
}
