"use client";

import { useEffect, useMemo, useState } from "react";
import { BrowserProvider } from "ethers";
import { getBrowserProvider, getKittiesContractRead, getKittiesContractWrite } from "@/lib/eth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BreedDialog } from "@/components/breed-dialog";
import { KittyCard, type KittyView } from "@/components/kitty-card";

export function KittiesDashboard() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [tokenIdCounter, setTokenIdCounter] = useState<number>(1);
  const [all, setAll] = useState<KittyView[]>([]);
  const [mine, setMine] = useState<KittyView[]>([]);

  const canUseWallet = useMemo(() => typeof window !== "undefined" && !!window.ethereum, []);

  useEffect(() => {
    if (!canUseWallet) return;
    const p = getBrowserProvider();
    setProvider(p);

    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accs: string[]) => setAccount(accs?.[0] ?? null))
      .catch(() => setAccount(null));

    const onAccounts = (accs: string[]) => setAccount(accs?.[0] ?? null);
    window.ethereum.on?.("accountsChanged", onAccounts);
    return () => window.ethereum.removeListener?.("accountsChanged", onAccounts);
  }, [canUseWallet]);

  async function load() {
    if (!provider) return;
    try {
      setLoading(true);
      const c = getKittiesContractRead(provider);

      const counterBn = await c._tokenIdCounter();
      const counter = Number(counterBn);
      setTokenIdCounter(counter);

      const items: KittyView[] = [];

      // Scan minted IDs: 1..counter-1 (sequential mint)
      for (let id = 1; id < counter; id++) {
        const [genes, birthTime, momId, dadId, generation] = await c.kitties(id);
        const owner = await c.ownerOf(id);

        items.push({
          id,
          owner,
          genes: genes.toString(),
          birthTime: Number(birthTime),
          momId: Number(momId),
          dadId: Number(dadId),
          generation: Number(generation),
        });
      }

      setAll(items);
      if (account) {
        const me = account.toLowerCase();
        setMine(items.filter((k) => k.owner.toLowerCase() === me));
      } else {
        setMine([]);
      }
    } catch (e: any) {
      toast.error("Failed to load kitties",{ description: e?.message ?? "Try again." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, account]);

  async function onBreed(momId: number, dadId: number) {
    try {
      const c = await getKittiesContractWrite();
      const tx = await c.breed(momId, dadId);
      toast("Breeding submitted",{ description: `Tx: ${tx.hash.slice(0, 10)}…` });
      await tx.wait();
      toast.success("Breed successful",{ description: "Your new kitty has been minted." });
      await load();
    } catch (e: any) {
      toast.error("Breed failed",{ description: e?.shortMessage ?? e?.message ?? "Try again." });
    }
  }

  const stats = useMemo(() => {
    const total = Math.max(0, tokenIdCounter - 1);
    return { total, mine: mine.length };
  }, [tokenIdCounter, mine.length]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Your Kitty Lab</CardTitle>
            <p className="text-sm text-muted-foreground">
              Browse minted kitties and breed new ones directly on-chain.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{stats.total} total minted</Badge>
            <Badge variant="secondary">{stats.mine} owned by you</Badge>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={load} disabled={loading}>
                {loading ? "Refreshing…" : "Refresh"}
              </Button>
              <BreedDialog
                ownedKitties={mine}
                disabled={!account || mine.length < 2}
                onBreed={onBreed}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">How breeding works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>You must own both mom and dad token IDs.</p>
            <p>Genes are derived from parents + timestamp, and generation increments.</p>
            <p className="text-xs">
              Tip: minting is sequential, so small scans are fast on Sepolia.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Kitties</TabsTrigger>
          <TabsTrigger value="mine">My Kitties</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((k) => (
              <KittyCard key={k.id} kitty={k} highlightOwner={account} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mine">
          {account ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mine.map((k) => (
                <KittyCard key={k.id} kitty={k} highlightOwner={account} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Connect your wallet to view your kitties.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
