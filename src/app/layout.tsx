import React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import "@/app/globals.css";

import { NavigationBar } from "@/components/navigationBar/nav";
import { Toaster } from "react-hot-toast";
import { SiteFooter } from "@/components/siteFooter";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | B2DVentures",
    default: "B2DVentures",
  },
  description: "B2DVentures is a financial services company.",
};

interface RootLayoutProps {
  children: Readonly<React.ReactNode>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <head />
        <body className={`${montserrat.className}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <div>
                <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 1000 }} />
              </div>
              <NavigationBar />
              <div className="flex-1 bg-background">{children}</div>
            </div>
            <SiteFooter />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
