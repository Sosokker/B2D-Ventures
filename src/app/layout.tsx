import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/app/globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>{children}</body>
    </html>
  );
}
