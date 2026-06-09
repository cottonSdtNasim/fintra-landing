import localFont from "next/font/local";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { StoreHydration } from "../components/providers/StoreHydration";
import { PageLoader } from "../components/layout/PageLoader";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "../components/fonts/GeneralSansFont/GeneralSans-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../components/fonts/GeneralSansFont/GeneralSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../components/fonts/GeneralSansFont/GeneralSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../components/fonts/GeneralSansFont/GeneralSans-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../components/fonts/GeneralSansFont/GeneralSans-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

const adorNoirrit = localFont({
  src: [
    {
      path: "../components/fonts/LI Ador Noirrit Font/Li Ador Noirrit Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../components/fonts/LI Ador Noirrit Font/Li Ador Noirrit Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../components/fonts/LI Ador Noirrit Font/Li Ador Noirrit SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../components/fonts/LI Ador Noirrit Font/Li Ador Noirrit Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ador-noirrit",
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s | BrokerEdge",
    default: "BrokerEdge | Advanced Market Analytics",
  },
  description:
    "Advanced stock screeners, heatmaps, charts and data table solutions for professional share market traders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${generalSans.className} ${generalSans.variable} ${adorNoirrit.variable} flex min-h-screen flex-col antialiased relative`}
      >
        <StoreHydration />
        <Navbar />
        <main className="flex-1 w-full relative">
          {/* <PageLoader>{children}</PageLoader> */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
