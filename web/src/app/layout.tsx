import type { Metadata } from "next";
import "./globals.css";
import "@/features/pulse/pulse.css";
import { DemoProvider } from "@/features/pulse/provider";

export const metadata: Metadata = {
  title: "Big Pulse — Care, with clarity",
  description:
    "Explore Big Pulse with fictional data: doctor discovery, physical appointments, laboratory reports and health information.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
