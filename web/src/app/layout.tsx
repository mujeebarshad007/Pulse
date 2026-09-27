import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PULSE — Design studio",
  description:
    "Compare three PULSE interface directions using clearly labelled fictional data. This is a design preview, not a live healthcare service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
