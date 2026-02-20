import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Simple CryptoKitties",
  description: "Breed kitties on Sepolia — a portfolio Web3 dApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
