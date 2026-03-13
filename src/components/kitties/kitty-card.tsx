"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type KittyView, shortAddress, formatDate, formatTime } from "@/lib/web3";

function generateKittyVisual(genes: string): string {
  const hash = BigInt(genes);
  const h1 = Number((hash >> 0n) % 360n);
  const h2 = Number((hash >> 20n) % 360n);
  const h3 = Number((hash >> 40n) % 360n);
  const s = 70 + Number((hash >> 60n) % 20n);
  const l1 = 50 + Number((hash >> 80n) % 20n);
  const l2 = 45 + Number((hash >> 100n) % 20n);

  return `
    radial-gradient(circle at 30% 30%, hsl(${h1} ${s}% ${l1}%) 0%, transparent 40%),
    radial-gradient(circle at 70% 40%, hsl(${h2} ${s}% ${l2}%) 0%, transparent 35%),
    radial-gradient(circle at 50% 70%, hsl(${h3} ${s}% ${l1 - 10}%) 0%, transparent 45%),
    linear-gradient(135deg, hsl(${h1} ${s}% ${l1 - 15}%) 0%, hsl(${h2} ${s}% ${l2 - 10}%) 100%)
  `;
}

function KittyVisual({ genes }: { genes: string }) {
  return (
    <div
      className="relative h-40 w-full overflow-hidden"
      style={{ background: generateKittyVisual(genes) }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-cyan-300/20 via-transparent to-pink-400/20" />
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
        <span className="rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[11px] font-medium tracking-wide text-slate-100 backdrop-blur-sm">
          GENOME
        </span>
        <span className="text-sm font-semibold text-white/90 drop-shadow-lg">
          {genes.slice(0, 6)}...
        </span>
      </div>
      <div className="absolute top-3 right-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3c.7 0 1.4.1 2 .4" />
            <path d="M12 21c-.7 0-1.4-.1-2-.4" />
            <path d="M3 12c.7 0 1.4.1 2 .4" />
            <path d="M21 12c-.7 0-1.4-.1-2-.4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface KittyCardProps {
  kitty: KittyView;
  highlightOwner?: string | null;
}

export function KittyCard({ kitty, highlightOwner }: KittyCardProps) {
  const isMine =
    !!highlightOwner && kitty.owner.toLowerCase() === highlightOwner.toLowerCase();

  return (
    <Card className="group gradient-border overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_22px_42px_hsl(266_93%_63%_/_0.22)]">
      <KittyVisual genes={kitty.genes} />
      <CardContent className="relative space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-indigo-300/25 bg-indigo-500/12 text-indigo-100"
            >
              Token #{kitty.id}
            </Badge>
            <Badge
              variant="secondary"
              className="border-cyan-300/25 bg-cyan-400/10 text-cyan-100"
            >
              Gen {kitty.generation}
            </Badge>
            {isMine && (
              <Badge className="border-emerald-300/30 bg-emerald-400/12 text-emerald-100">
                Yours
              </Badge>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
            Genes
          </p>
          <p className="break-all font-mono text-xs text-foreground/90">{kitty.genes}</p>
        </div>

        <div className="surface-divider" />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Born</span>
            <span className="text-foreground/80">
              {formatDate(kitty.birthTime)} {formatTime(kitty.birthTime)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Parents</span>
            <span className="font-mono text-foreground/80">
              #{kitty.momId} x #{kitty.dadId}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Owner</span>
            <span className="font-mono text-foreground/80">{shortAddress(kitty.owner)}</span>
          </div>
        </div>

        <div className="absolute right-4 top-[calc(10rem+8px)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-200">
            NFT
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export { type KittyView };
