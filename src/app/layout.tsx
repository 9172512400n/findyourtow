import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoadAssistNow | Premium Tow Dispatch",
  description:
    "Premium tow dispatch for customers, drivers, and operators. Request roadside help, track drivers live, and manage towing from one modern platform.",
  applicationName: "RoadAssistNow",
  metadataBase: new URL("https://roadassistnow.com"),
  openGraph: {
    title: "RoadAssistNow | Premium Tow Dispatch",
    description: "The real-time roadside dispatch platform for fast, transparent tow coordination.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[#050608] font-sans text-white">{children}</body>
    </html>
  );
}
