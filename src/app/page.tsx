"use client";

import { AppHeader } from "@/components/app-header";
import { KittiesDashboard } from "@/components/kitties/kitties-dashboard";
import { useWallet } from "@/hooks/useWallet";
import { useKitties } from "@/hooks/useKitties";
import { CONTRACTS } from "@/lib/chain";
import { ExternalLink } from "lucide-react";

export default function Home() {
  const {
    address,
    chainId,
    isCorrectNetwork,
    isConnecting,
    error,
    connect,
    switchNetwork,
  } = useWallet();

  const {
    allKitties,
    myKitties,
    totalSupply,
    isLoading,
    isBreeding,
    breedTxHash,
    breedSuccess,
    error: kittiesError,
    loadKitties,
    breed,
    clearBreedState,
  } = useKitties(address);

  const displayError = error || kittiesError;

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        address={address}
        chainId={chainId}
        isCorrectNetwork={isCorrectNetwork}
        isConnecting={isConnecting}
        error={displayError}
        onConnect={connect}
        onSwitchNetwork={switchNetwork}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <KittiesDashboard
          allKitties={allKitties}
          myKitties={myKitties}
          totalSupply={totalSupply}
          isLoading={isLoading}
          isBreeding={isBreeding}
          breedTxHash={breedTxHash}
          breedSuccess={breedSuccess}
          breedError={kittiesError}
          address={address}
          onRefresh={loadKitties}
          onBreed={breed}
          onClearBreedState={clearBreedState}
        />
      </main>

      <footer className="border-t border-white/10 bg-slate-950/25 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <p>
              Built with Next.js + ethers.js -{" "}
              <span className="hidden sm:inline">Powered by Simple CryptoKitties</span>
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACTS.kitties}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-300 hover:underline"
              >
                View Contract
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
