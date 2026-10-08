import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import "@/features/pulse/pulse.css";
import "@/features/pulse/next-ui.css";
import "@/features/pulse/motion.css";
import { ExperienceControls } from "@/features/pulse/experience-controls";
import "@/features/pulse/typography.css";
import { DemoProvider } from "@/features/pulse/provider";

const manrope = localFont({
  src: "../fonts/Manrope-Variable.ttf",
  variable: "--font-pulse",
  weight: "200 800",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Pulse — Care, with clarity",
  description:
    "Explore Pulse with fictional data: doctor discovery, physical appointments, laboratory reports and health information.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <DemoProvider connected={process.env.APP_MODE !== "demo"}>
          {children}
          <ExperienceControls />
        </DemoProvider>
      </body>
    </html>
  );
}
