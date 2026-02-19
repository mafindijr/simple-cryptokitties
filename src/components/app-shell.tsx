"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTRACTS, SEPOLIA } from "@/lib/chain";
import { ensureSepolia, getBrowserProvider } from "@/lib/eth";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export function AppShell({ children }: { children: React.ReactNode }) {
    
  const [address, setAddress] = useState<string | null>(null);
  const [chainOk, setChainOk] = useState<boolean>(false);
  const [connecting, setConnecting] = useState(false);

  const hasWallet = useMemo(() => typeof window !== "undefined" && !!window.ethereum, []);

  async function refresh() {
    if (!hasWallet) return;

    const provider = getBrowserProvider();
    const network = await provider.getNetwork();
    setChainOk(Number(network.chainId) === SEPOLIA.chainId);

    const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
    setAddress(accounts?.[0] ?? null);
  }

  async function connect() {
    if (!hasWallet) {
      toast.error("Wallet not found", { description: "Install MetaMask to continue." });
      return;
    }
    try {
      setConnecting(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await ensureSepolia();
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await refresh();
    } catch (e: any) {
      toast.error("Connection failed", { description: e?.message ?? "Try again." });
    } finally {
      setConnecting(false);
    }
  }

  async function switchNetwork() {
    try {
      await ensureSepolia();
      await refresh();
    } catch (e: any) {
      toast.error("Network switch failed", { description: e?.message ?? "Try again." });
    }
  }

  useEffect(() => {
    refresh();

    if (!window.ethereum) return;
    const onAccounts = () => refresh();
    const onChain = () => refresh();
    window.ethereum.on?.("accountsChanged", onAccounts);
    window.ethereum.on?.("chainChanged", onChain);

    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAccounts);
      window.ethereum.removeListener?.("chainChanged", onChain);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-primary/20 ring-1 ring-primary/40" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Simple CryptoKitties</div>
              <div className="text-xs text-muted-foreground">
                Breed NFTs on <span className="font-medium">{SEPOLIA.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Sepolia
            </Badge>

            {address ? (
              <>
                {!chainOk && (
                  <Button variant="secondary" onClick={switchNetwork}>
                    Switch to Sepolia
                  </Button>
                )}
                <Button variant="outline">{shortAddr(address)}</Button>
              </>
            ) : (
              <Button onClick={connect} disabled={connecting}>
                {connecting ? "Connecting…" : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-muted-foreground">
        Built with Next.js + ethers v6 • Contract: {CONTRACTS.kitties}
      </footer>
    </div>
  );
}
