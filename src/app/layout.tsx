import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Simple CryptoKitties | Web3 NFT dApp",
  description:
    "Breed, collect, and trade unique CryptoKitties on Sepolia Testnet. A portfolio-level Web3 NFT dApp built with Next.js, TypeScript, and ethers.js.",
  keywords: ["CryptoKitties", "NFT", "Web3", "Ethereum", "Sepolia", "Next.js"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(231 36% 10% / 0.9)",
              border: "1px solid hsl(230 28% 76% / 0.18)",
              backdropFilter: "blur(14px)",
              color: "hsl(210 40% 98%)",
            },
          }}
        />
      </body>
    </html>
  );
}
