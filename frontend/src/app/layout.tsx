import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SatQuery AI — Multimodal Geospatial Analysis",
  description:
    "Evidence-grounded natural-language analysis of optical, SAR, and geospatial satellite imagery. SIH 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
