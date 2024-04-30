import { CSPostHogProvider } from "@/components/Providers/PostHogClientProvider";
import SiteFooter from "@/components/layout/navigation/site-footer";
import SiteNav from "@/components/layout/navigation/site-nav";
import { Toaster } from "@/components/ui/sonner";
import siteMetadata from "@/config/site-metadata";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import ConvexClientProvider from "../components/Providers/ConvexClientProvider";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteMetadata.title,
  metadataBase: new URL(siteMetadata.siteUrl),
  description: siteMetadata.description,
  keywords: [
    "online forms",
    "form management",
    "form submissions",
    "feedback forms",
    "contact forms",
    "survey tool",
    "data collection",
    "form builder",
    "form analytics",
    "web forms",
    "email notifications",
    "spam protection",
    "secure forms",
    "custom forms",
    "form integration",
    "automated forms",
    "form processing",
    "form automation",
    "form data handling",
    "form services",
  ],
  authors: [{ name: siteMetadata.author }],
  creator: "GrayTech Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteMetadata.siteUrl,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
    images: [
      {
        url: "https://formail.dev/api/og",
        width: 1200,
        height: 630,
        alt: "Formail",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "https://formail.dev/api/og",
        width: 1200,
        height: 630,
        alt: "Formail",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <CSPostHogProvider>
        <html lang="en">
          <body
            className={`${sora.className} flex min-h-screen flex-col antialiased`}
          >
            <SiteNav />
            {children}
            <SiteFooter />
            <Toaster richColors />
            <Analytics />
            <SpeedInsights />
          </body>
        </html>
      </CSPostHogProvider>
    </ConvexClientProvider>
  );
}
