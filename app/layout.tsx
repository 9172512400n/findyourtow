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
  title: "FindYourTow | Real-Time Roadside Dispatch",
  description:
    "A smart towing platform for customers, drivers, dispatchers, and admins with instant quotes, secure payments, and live roadside coordination.",
  applicationName: "FindYourTow",
  metadataBase: new URL("https://findyourtow.com"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/findyourtow-192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icons/findyourtow-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [{ url: "/icons/findyourtow-192.jpg", sizes: "192x192", type: "image/jpeg" }],
  },
  appleWebApp: {
    capable: true,
    title: "FindYourTow",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "FindYourTow | Real-Time Roadside Dispatch",
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
