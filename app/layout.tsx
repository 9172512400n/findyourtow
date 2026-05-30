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
  title: "RoadAssistNow | Real-Time Roadside Dispatch",
  description:
    "A smart towing platform for customers, drivers, dispatchers, and admins with instant quotes, secure payments, and live roadside coordination.",
  applicationName: "RoadAssistNow",
  metadataBase: new URL("https://roadassistnow.com"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/roadassistnow-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/roadassistnow-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/roadassistnow-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "RoadAssistNow",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "RoadAssistNow | Real-Time Roadside Dispatch",
    description: "Request roadside help, pay securely, and track the tow truck live.",
    type: "website",
    images: [{ url: "/brand/roadassistnow-header-lockup.png", width: 1200, height: 630, alt: "RoadAssistNow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoadAssistNow | Real-Time Roadside Dispatch",
    description: "Request roadside help, pay securely, and track the tow truck live.",
    images: ["/brand/roadassistnow-header-lockup.png"],
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
