"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function KittyPlaceholder() {
  return (
    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.03]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="42"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan-200"
      >
        <path d="M12 3c.7 0 1.4.1 2 .4" />
        <path d="M12 21c-.7 0-1.4-.1-2-.4" />
        <path d="M3 12c.7 0 1.4.1 2 .4" />
        <path d="M21 12c-.7 0-1.4-.1-2-.4" />
        <circle cx="12" cy="12" r="7" />
      </svg>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("gradient-border rounded-2xl p-8 text-center", className)}>
      {icon ?? <KittyPlaceholder />}
      <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-muted-foreground">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

export function NoKittiesState({
  connected,
  onConnect,
}: {
  connected: boolean;
  onConnect?: () => void;
}) {
  if (!connected) {
    return (
      <EmptyState
        title="Connect Your Wallet"
        description="Connect your wallet to view your NFT collection and start breeding."
        action={onConnect ? { label: "Connect Wallet", onClick: onConnect } : undefined}
      />
    );
  }

  return (
    <EmptyState
      title="No kitties yet — breed your first one 🐱"
      description="Your collection is empty right now. Use the Breed Kitty section above to mint your first NFT."
    />
  );
}

export function NoBreedableState({ hasKitties }: { hasKitties: boolean }) {
  return (
    <EmptyState
      title="Need More Kitties"
      description={
        hasKitties
          ? "You need at least 2 kitties in your wallet to breed."
          : "You need at least 2 kitties to breed. Connect your wallet and check your collection."
      }
      className="p-6"
    />
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="gradient-border rounded-2xl p-8 text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-300" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
