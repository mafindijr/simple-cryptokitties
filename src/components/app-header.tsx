"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { shortAddress, SEPOLIA } from "@/lib/web3";
import { Link2, Wallet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/20 animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-40 bg-muted/50 rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-9 w-32 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center glow-sm">
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
              <div className="text-base font-bold gradient-text">
                Simple CryptoKitties
              </div>
              <div className="text-xs text-muted-foreground">
                Breed NFTs on <span className="text-primary font-medium">{SEPOLIA.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {error && (
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="max-w-[150px] truncate">{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {address ? (
                <>
                  {isCorrectNetwork ? (
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border-green-500/30"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {SEPOLIA.name}
                    </Badge>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onSwitchNetwork}
                      className="text-amber-400 border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20"
                    >
                      <Link2 className="h-3.5 w-3.5 mr-1.5" />
                      Switch Network
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">
                      {shortAddress(address)}
                    </span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onConnect}
                  disabled={isConnecting}
                  size="sm"
                  className="gap-2"
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
