"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type KittyView = {
  id: number;
  owner: string;
  genes: string;
  birthTime: number;
  momId: number;
  dadId: number;
  generation: number;
};

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function geneGradient(genes: string) {
  // Deterministic “art” based on gene string
  // Using slices of the gene string as HSL-ish numbers
  const a = Number(BigInt("0x" + BigInt(genes).toString(16).slice(0, 6)) % 360n);
  const b = Number(BigInt("0x" + BigInt(genes).toString(16).slice(6, 12) || "0") % 360n);
  return `conic-gradient(from 180deg, hsl(${a} 80% 55%), hsl(${b} 85% 60%), hsl(${(a + b) % 360} 70% 50%))`;
}

export function KittyCard({ kitty, highlightOwner }: { kitty: KittyView; highlightOwner?: string | null }) {
  const isMine =
    !!highlightOwner && kitty.owner.toLowerCase() === highlightOwner.toLowerCase();

  const date = new Date(kitty.birthTime * 1000);

  return (
    <Card className="overflow-hidden">
      <div
        className="h-32 w-full"
        style={{ background: geneGradient(kitty.genes) }}
      />
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Kitty #{kitty.id}</div>
          <div className="flex gap-2">
            <Badge variant="secondary">Gen {kitty.generation}</Badge>
            {isMine ? <Badge>Owned</Badge> : null}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Owner: {shortAddr(kitty.owner)}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Born</span>
          <span className="text-foreground">{date.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Parents</span>
          <span className="text-foreground">
            #{kitty.momId} × #{kitty.dadId}
          </span>
        </div>
        <div className="text-xs text-muted-foreground break-all">
          Genes: {kitty.genes.slice(0, 28)}…
        </div>
      </CardContent>
    </Card>
  );
}
