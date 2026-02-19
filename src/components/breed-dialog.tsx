"use client";

import { useMemo } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { KittyView } from "@/components/kitty-card";

const schema = z
  .object({
    momId: z.coerce.number().int().positive(),
    dadId: z.coerce.number().int().positive(),
  })
  .refine((v) => v.momId !== v.dadId, {
    message: "Mom and Dad must be different.",
    path: ["dadId"],
  });

type BreedForm = z.output<typeof schema>;

export function BreedDialog({
  ownedKitties,
  disabled,
  onBreed,
}: {
  ownedKitties: KittyView[];
  disabled?: boolean;
  onBreed: (momId: number, dadId: number) => Promise<void> | void;
}) {
  const defaultMom = ownedKitties[0]?.id ?? 1;
  const defaultDad = ownedKitties[1]?.id ?? 2;

  const form = useForm<BreedForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: { momId: defaultMom, dadId: defaultDad },
    mode: "onSubmit",
  });

  const ownedIds = useMemo(() => new Set(ownedKitties.map((k) => k.id)), [ownedKitties]);

  const submit: SubmitHandler<BreedForm> = async (values) => {
    if (!ownedIds.has(values.momId) || !ownedIds.has(values.dadId)) {
      form.setError("momId", { message: "You must own both token IDs." });
      return;
    }
    await onBreed(values.momId, values.dadId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Breed</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Breed a new Kitty</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <Label>Mom Token ID</Label>
            <Input type="number" min={1} {...form.register("momId")} />
            {form.formState.errors.momId?.message ? (
              <p className="text-xs text-red-500">{form.formState.errors.momId.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Must be a token ID you own.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Dad Token ID</Label>
            <Input type="number" min={1} {...form.register("dadId")} />
            {form.formState.errors.dadId?.message ? (
              <p className="text-xs text-red-500">{form.formState.errors.dadId.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Must be a different token ID you own.</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Confirm Breed
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}



// "use client";

// import { useMemo } from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import type { KittyView } from "@/components/kitty-card";

// const schema = z.object({
//   momId: z.coerce.number().int().positive(),
//   dadId: z.coerce.number().int().positive(),
// }).refine((v) => v.momId !== v.dadId, { message: "Mom and Dad must be different.", path: ["dadId"] });

// export function BreedDialog({
//   ownedKitties,
//   disabled,
//   onBreed,
// }: {
//   ownedKitties: KittyView[];
//   disabled?: boolean;
//   onBreed: (momId: number, dadId: number) => Promise<void> | void;
// }) {


//   const defaultMom = ownedKitties[0]?.id ?? 1;
//   const defaultDad = ownedKitties[1]?.id ?? 2;

//   type BreedForm = z.infer<typeof schema>;

//   const form = useForm<BreedForm>({
//     resolver: zodResolver (schema) ,
//     defaultValues: { momId: defaultMom, dadId: defaultDad },
//   });

//   const ownedIds = useMemo(() => new Set(ownedKitties.map((k) => k.id)), [ownedKitties]);

//   async function submit(values: BreedForm) {
//     if (!ownedIds.has(values.momId) || !ownedIds.has(values.dadId)) {
//       form.setError("momId", { message: "You must own both token IDs." });
//       return;
//     }
//     await onBreed(values.momId, values.dadId);
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button disabled={disabled}>Breed</Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Breed a new Kitty</DialogTitle>
//         </DialogHeader>

//         <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
//           <div className="space-y-2">
//             <Label>Mom Token ID</Label>
//             <Input type="number" min={1} {...form.register("momId")} />
//             {form.formState.errors.momId?.message ? (
//               <p className="text-xs text-red-500">{form.formState.errors.momId.message}</p>
//             ) : (
//               <p className="text-xs text-muted-foreground">
//                 Must be a token ID you own.
//               </p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label>Dad Token ID</Label>
//             <Input type="number" min={1} {...form.register("dadId")} />
//             {form.formState.errors.dadId?.message ? (
//               <p className="text-xs text-red-500">{form.formState.errors.dadId.message}</p>
//             ) : (
//               <p className="text-xs text-muted-foreground">
//                 Must be a different token ID you own.
//               </p>
//             )}
//           </div>

//           <Button type="submit" className="w-full">
//             Confirm Breed
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
