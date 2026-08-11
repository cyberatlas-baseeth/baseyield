import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Baseyield-ai — Best Yield Opportunities on Base",
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
    title: "Baseyield-ai — Best Yield Opportunities on Base",
    description:
      "AI-powered yield discovery agent for the Base blockchain. Ask any question about Base yields.",
    type: "website",
    siteName: "Baseyield-ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseyield-ai — Best Yield Opportunities on Base",
    description:
      "AI-powered yield discovery agent for the Base blockchain.",
  },
  other: {
    "talentapp:project_verification": "20e44ca705227f4c71ae32a0cf2ccf83c2f07ef018f25327c883ed589d47df661406e69cb623844b1a52aef9824df46c9d5b26ee1efe92712c1b83cf5ddebf93",
    "base:app_id": "6a7a2b3f89d920176739d24a",
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
