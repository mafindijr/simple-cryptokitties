"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type KittyView, shortAddress, EXPLORER_URL } from "@/lib/web3";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Heart,
  Sparkles,
} from "lucide-react";

const schema = z.object({
  momId: z.string().min(1, "Please select a mom"),
  dadId: z.string().min(1, "Please select a dad"),
});

type BreedForm = z.infer<typeof schema>;

interface BreedDialogProps {
  ownedKitties: KittyView[];
  disabled?: boolean;
  isBreeding: boolean;
  txHash: string | null;
  success: boolean;
  error: string | null;
  onBreed: (momId: number, dadId: number) => void;
  onClose: () => void;
}

export function BreedDialog({
  ownedKitties,
  disabled,
  isBreeding,
  txHash,
  success,
  error,
  onBreed,
  onClose,
}: BreedDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<BreedForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      momId: "",
      dadId: "",
    },
  });

  useEffect(() => {
    if (open && ownedKitties.length >= 2) {
      form.setValue("momId", String(ownedKitties[0].id));
      form.setValue("dadId", String(ownedKitties[1].id));
    }
  }, [open, ownedKitties, form]);

  useEffect(() => {
    if (success && open) {
      setTimeout(() => {
        setOpen(false);
        onClose();
      }, 2000);
    }
  }, [success, open, onClose]);

  const handleClose = () => {
    if (!isBreeding) {
      setOpen(false);
      form.reset();
      onClose();
    }
  };

  const onSubmit = (values: BreedForm) => {
    onBreed(Number(values.momId), Number(values.dadId));
  };

  const canBreed = ownedKitties.length >= 2;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setOpen(true);
        else handleClose();
      }}
    >
      <DialogTrigger asChild>
        <Button
          disabled={disabled || !canBreed}
          className="gap-2 shadow-[0_0_30px_hsl(266_93%_63%_/_0.18)]"
        >
          <Heart className="h-4 w-4" />
          Breed Kitty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {isBreeding || txHash || success || error ? (
          <BreedStatus
            isBreeding={isBreeding}
            txHash={txHash}
            success={success}
            error={error}
            onClose={handleClose}
          />
        ) : (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                Breed New Kitty
              </DialogTitle>
              <DialogDescription>
                Choose two different kitties from your wallet and mint the next generation.
              </DialogDescription>
            </DialogHeader>

            <div className="surface-divider" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mom">Mom</Label>
                <Select
                  value={form.watch("momId")}
                  onValueChange={(value) => form.setValue("momId", value)}
                >
                  <SelectTrigger id="mom">
                    <SelectValue placeholder="Select mom kitty" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownedKitties.map((kitty) => (
                      <SelectItem key={kitty.id} value={String(kitty.id)}>
                        #{kitty.id} - Gen {kitty.generation} - {shortAddress(kitty.owner)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.momId && (
                  <p className="text-xs text-red-300">{form.formState.errors.momId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dad">Dad</Label>
                <Select
                  value={form.watch("dadId")}
                  onValueChange={(value) => form.setValue("dadId", value)}
                >
                  <SelectTrigger id="dad">
                    <SelectValue placeholder="Select dad kitty" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownedKitties
                      .filter((kitty) => kitty.id !== Number(form.watch("momId")))
                      .map((kitty) => (
                        <SelectItem key={kitty.id} value={String(kitty.id)}>
                          #{kitty.id} - Gen {kitty.generation} - {shortAddress(kitty.owner)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.dadId && (
                  <p className="text-xs text-red-300">{form.formState.errors.dadId.message}</p>
                )}
              </div>

              {form.watch("momId") && form.watch("dadId") && (
                <div className="rounded-xl border border-white/12 bg-white/[0.03] p-3 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    New Kitty Preview
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Generation</span>
                    <Badge variant="secondary" className="border-cyan-300/25 bg-cyan-400/10 text-cyan-200">
                      Gen{" "}
                      {Math.max(
                        0,
                        Math.max(
                          ...ownedKitties
                            .filter(
                              (kitty) =>
                                kitty.id === Number(form.watch("momId")) ||
                                kitty.id === Number(form.watch("dadId"))
                            )
                            .map((kitty) => kitty.generation)
                        ) + 1
                      )}
                    </Badge>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isBreeding}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !form.watch("momId") ||
                    !form.watch("dadId") ||
                    form.watch("momId") === form.watch("dadId")
                  }
                  className="gap-2"
                >
                  {isBreeding && <Loader2 className="h-4 w-4 animate-spin" />}
                  Breed Kitties
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BreedStatus({
  isBreeding,
  txHash,
  success,
  error,
  onClose,
}: {
  isBreeding: boolean;
  txHash: string | null;
  success: boolean;
  error: string | null;
  onClose: () => void;
}) {
  return (
    <div className="py-6 text-center">
      {isBreeding && (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Breeding in Progress</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Confirm the transaction in your wallet to continue.
          </p>
        </>
      )}

      {txHash && !success && !error && (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/10">
            <Loader2 className="h-8 w-8 animate-spin text-amber-300" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Transaction Submitted</h3>
          <p className="mb-4 text-sm text-muted-foreground">Waiting for on-chain confirmation.</p>
          <a
            href={`${EXPLORER_URL}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:underline"
          >
            View on Etherscan
            <ExternalLink className="h-3 w-3" />
          </a>
        </>
      )}

      {success && (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-300" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-emerald-300">Breeding Successful</h3>
          <p className="mb-4 text-sm text-muted-foreground">Your new kitty has been minted.</p>
          {txHash && (
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:underline"
            >
              View on Etherscan
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </>
      )}

      {error && (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-300/30 bg-red-400/10">
            <AlertCircle className="h-8 w-8 text-red-300" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-300">Breeding Failed</h3>
          <p className="mb-4 text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={onClose}>
            Try Again
          </Button>
        </>
      )}
    </div>
  );
}
