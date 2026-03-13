"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { shortAddress, SEPOLIA } from "@/lib/web3";
import {
  Link2,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface AppHeaderProps {
  address: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onSwitchNetwork: () => void;
}

export function AppHeader({
  address,
  chainId,
  isCorrectNetwork,
  isConnecting,
  error,
  onConnect,
  onSwitchNetwork,
}: AppHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary via-violet-400 to-cyan-400 flex items-center justify-center glow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 3c.7 0 1.4.1 2 .4" />
                <path d="M12 21c-.7 0-1.4-.1-2-.4" />
                <path d="M3 12c.7 0 1.4.1 2 .4" />
                <path d="M21 12c-.7 0-1.4-.1-2-.4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold gradient-text tracking-wide">
                Simple CryptoKitties
              </div>
              <div className="text-xs text-muted-foreground/90">
                Breed NFTs on{" "}
                <span className="text-cyan-300 font-medium">{SEPOLIA.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {error && (
              <div className="hidden md:flex items-center gap-1.5 rounded-full border border-red-400/25 bg-red-500/10 px-2.5 py-1 text-xs text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="max-w-[150px] truncate">{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2 sm:gap-2.5">
              {address ? (
                <>
                  {isCorrectNetwork ? (
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline-flex items-center gap-1.5 border-cyan-300/30 bg-cyan-400/12 text-cyan-200"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {SEPOLIA.name}
                    </Badge>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onSwitchNetwork}
                      className="text-amber-300 border-amber-300/35 bg-amber-400/12 hover:bg-amber-400/22"
                    >
                      <Link2 className="h-3.5 w-3.5 mr-1.5" />
                      Switch Network
                    </Button>
                  )}

                  <div className="flex items-center rounded-xl border border-white/15 bg-white/[0.04] p-1 backdrop-blur-xl">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 hover:bg-white/[0.08]"
                    >
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <Wallet className="h-4 w-4 text-cyan-200" />
                      <span className="hidden sm:inline text-sm text-slate-100">
                        {shortAddress(address)}
                      </span>
                      {chainId && (
                        <span className="hidden md:inline text-[10px] uppercase tracking-wider text-muted-foreground">
                          #{chainId}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 rounded-lg border border-transparent hover:border-cyan-300/35 hover:bg-cyan-400/10"
                      onClick={copyAddress}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={onConnect}
                  disabled={isConnecting}
                  size="sm"
                  className="gap-2 animate-breathe-glow"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
