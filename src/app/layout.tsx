import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "YieldPulse — Best Yield Opportunities on Base",
  description:
    "AI-powered yield discovery agent for the Base blockchain. Find the best DeFi yields, compare protocols, and discover high-APY opportunities on Base.",
  keywords: [
    "Base",
    "DeFi",
    "yield",
    "APY",
    "Morpho",
    "Aave",
    "blockchain",
    "crypto",
    "staking",
  ],
  openGraph: {
    title: "YieldPulse — Best Yield Opportunities on Base",
    description:
      "AI-powered yield discovery agent for the Base blockchain. Ask any question about Base yields.",
    type: "website",
    siteName: "YieldPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "YieldPulse — Best Yield Opportunities on Base",
    description:
      "AI-powered yield discovery agent for the Base blockchain.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
