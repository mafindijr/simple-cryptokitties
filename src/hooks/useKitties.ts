"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BrowserProvider,
  type Contract,
} from "ethers";

import {
  getReadContract,
  getWriteContract,
  getTotalSupply,
  fetchAllKitties,
  breedKitty,
  waitForTransaction,
  type KittyView,
} from "@/lib/web3";

export type UseKittiesState = {
  allKitties: KittyView[];
  myKitties: KittyView[];
  totalSupply: number;
  isLoading: boolean;
  isBreeding: boolean;
  error: string | null;
  breedTxHash: string | null;
  breedSuccess: boolean;
};

const initialState: UseKittiesState = {
  allKitties: [],
  myKitties: [],
  totalSupply: 0,
  isLoading: false,
  isBreeding: false,
  error: null,
  breedTxHash: null,
  breedSuccess: false,
};

export function useKitties(address: string | null) {
  const [state, setState] = useState<UseKittiesState>(initialState);
  const [contract, setContract] = useState<Contract | null>(null);

  const loadKitties = useCallback(async () => {
    if (!address) {
      setState((prev) => ({
        ...prev,
        allKitties: [],
        myKitties: [],
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet found");
      }

      const provider = new BrowserProvider(window.ethereum);
      const readContract = getReadContract(provider);
      setContract(readContract);

      const total = await getTotalSupply(readContract);

      if (total <= 0) {
        setState((prev) => ({
          ...prev,
          allKitties: [],
          myKitties: [],
          totalSupply: 0,
          isLoading: false,
        }));
        return;
      }

      const allKitties = await fetchAllKitties(readContract, total);
      const myAddress = address.toLowerCase();
      const myKitties = allKitties.filter(
        (k) => k.owner.toLowerCase() === myAddress
      );

      setState((prev) => ({
        ...prev,
        allKitties,
        myKitties,
        totalSupply: total,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load kitties",
      }));
    }
  }, [address]);

  const breed = useCallback(
    async (momId: number, dadId: number) => {
      if (!address) {
        setState((prev) => ({
          ...prev,
          error: "Wallet not connected",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isBreeding: true,
        error: null,
        breedTxHash: null,
        breedSuccess: false,
      }));

      try {
        if (typeof window === "undefined" || !window.ethereum) {
          throw new Error("No wallet found");
        }

        const provider = new BrowserProvider(window.ethereum);
        const writeContract = await getWriteContract();
        
        const txHash = await breedKitty(writeContract, momId, dadId);
        
        setState((prev) => ({
          ...prev,
          breedTxHash: txHash,
        }));

        const success = await waitForTransaction(provider, txHash);

        setState((prev) => ({
          ...prev,
          isBreeding: false,
          breedSuccess: success,
          error: success ? null : "Transaction failed",
        }));

        if (success) {
          await loadKitties();
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isBreeding: false,
          breedSuccess: false,
          error: err instanceof Error ? err.message : "Breeding failed",
        }));
      }
    },
    [address, loadKitties]
  );

  const clearBreedState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      breedTxHash: null,
      breedSuccess: false,
      error: null,
    }));
  }, []);

  useEffect(() => {
    loadKitties();
  }, [address]);

  return {
    ...state,
    loadKitties,
    breed,
    clearBreedState,
  };
}
