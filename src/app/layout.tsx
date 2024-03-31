import CSPostHogProvider from "@/components/Providers/PostHogClientProvider";
import Header from "@/components/layout/Header/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import ConvexClientProvider from "../components/Providers/ConvexClientProvider";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Formail",
  description: "Sreamline your workflow with Formail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.className} flex min-h-screen flex-col antialiased`}
      >
        <CSPostHogProvider>
          <ConvexClientProvider>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </ConvexClientProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
