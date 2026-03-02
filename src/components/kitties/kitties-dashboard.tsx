"use client";

import { useMemo, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KittyCard } from "@/components/kitties/kitty-card";
import { BreedDialog } from "@/components/breed/breed-dialog";
import { KittyGridSkeleton, DashboardSkeleton } from "@/components/ui/skeleton";
import { NoKittiesState, NoBreedableState } from "@/components/ui/empty-state";
import { type KittyView } from "@/lib/web3";
import { RefreshCw, Flame, PawPrint, Users, Sparkles } from "lucide-react";

export interface KittiesDashboardProps {
  allKitties: KittyView[];
  myKitties: KittyView[];
  totalSupply: number;
  isLoading: boolean;
  isBreeding: boolean;
  breedTxHash: string | null;
  breedSuccess: boolean;
  breedError: string | null;
  address: string | null;
  onRefresh: () => void;
  onBreed: (momId: number, dadId: number) => void;
  onClearBreedState: () => void;
}

export function KittiesDashboard({
  allKitties,
  myKitties,
  totalSupply,
  isLoading,
  isBreeding,
  breedTxHash,
  breedSuccess,
  breedError,
  address,
  onRefresh,
  onBreed,
  onClearBreedState,
}: KittiesDashboardProps) {
  const stats = useMemo(() => {
    return {
      total: totalSupply,
      mine: myKitties.length,
      averageGen:
        allKitties.length > 0
          ? Math.round(
              allKitties.reduce((acc, kitty) => acc + kitty.generation, 0) /
                allKitties.length
            )
          : 0,
    };
  }, [totalSupply, myKitties.length, allKitties]);

  const canBreed = myKitties.length >= 2;

  if (isLoading && allKitties.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<PawPrint className="h-5 w-5" />}
          label="Total Kitties"
          value={stats.total}
          tone="primary"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="My Collection"
          value={stats.mine}
          tone="cyan"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Avg Generation"
          value={stats.averageGen}
          tone="pink"
        />
        <Card className="gradient-border">
          <CardContent className="flex h-full items-center justify-between gap-3 p-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Dashboard
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">Live on Sepolia</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-border">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                Breed Kitty
              </CardTitle>
              <CardDescription className="mt-1">
                Pair two kitties from your collection to mint a new one.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="border-white/15 bg-white/[0.05] text-slate-200">
              {myKitties.length} owned
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="surface-divider" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {canBreed
                ? "You have enough kitties to breed."
                : "You need at least 2 kitties to breed."}
            </div>
            <BreedDialog
              ownedKitties={myKitties}
              disabled={!address || !canBreed}
              isBreeding={isBreeding}
              txHash={breedTxHash}
              success={breedSuccess}
              error={breedError}
              onBreed={onBreed}
              onClose={onClearBreedState}
            />
          </div>
          {!canBreed && <NoBreedableState hasKitties={myKitties.length > 0} />}
        </CardContent>
      </Card>

      <SectionHeader
        title="My Kitties"
        description="Your wallet-owned NFT collection"
        right={address ? <Badge variant="secondary">{myKitties.length} kitties</Badge> : null}
      />

      {!address ? (
        <NoKittiesState connected={false} />
      ) : myKitties.length === 0 ? (
        <NoKittiesState connected={true} />
      ) : isLoading ? (
        <KittyGridSkeleton count={4} />
      ) : (
        <div className="kitty-grid">
          {myKitties.map((kitty) => (
            <KittyCard key={kitty.id} kitty={kitty} highlightOwner={address} />
          ))}
        </div>
      )}

      <SectionHeader
        title="All Kitties"
        description="Explore every kitty minted on the contract"
        right={<Badge variant="secondary">{allKitties.length} total</Badge>}
      />

      {allKitties.length === 0 ? (
        <NoKittiesState connected={!!address} />
      ) : isLoading ? (
        <KittyGridSkeleton count={8} />
      ) : (
        <div className="kitty-grid">
          {allKitties.map((kitty) => (
            <KittyCard key={kitty.id} kitty={kitty} highlightOwner={address} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  right,
}: {
  title: string;
  description: string;
  right?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {right}
      </div>
      <div className="surface-divider" />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: "primary" | "cyan" | "pink";
}) {
  const iconTone = {
    primary: "border-indigo-300/30 bg-indigo-400/15 text-indigo-200",
    cyan: "border-cyan-300/30 bg-cyan-400/14 text-cyan-200",
    pink: "border-pink-300/30 bg-pink-400/14 text-pink-200",
  };

  return (
    <Card className="gradient-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={`rounded-xl border p-2.5 ${iconTone[tone]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
