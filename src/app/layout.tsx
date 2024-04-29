import { CSPostHogProvider } from "@/components/Providers/PostHogClientProvider";
import SiteFooter from "@/components/layout/navigation/site-footer";
import SiteNav from "@/components/layout/navigation/site-nav";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Formail",
  description: "Streamline your workflow with Formail",
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
