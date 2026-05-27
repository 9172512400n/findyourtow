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
  title: "FindYourTow | On-Demand Tow Dispatch",
  description:
    "A scalable towing and roadside marketplace for customers, drivers, dispatchers, and admins with instant quotes, payments, and live tracking.",
  applicationName: "FindYourTow",
  metadataBase: new URL("https://findyourtow.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "FindYourTow",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "FindYourTow | On-Demand Tow Dispatch",
    description: "Request roadside help, pay securely, and track the tow truck live.",
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
