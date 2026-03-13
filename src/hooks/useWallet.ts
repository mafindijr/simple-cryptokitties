"use client";

import { useCallback, useEffect, useState } from "react";

import {
  type WalletState,
  getCurrentAddress,
  getCurrentChainId,
  requestAccounts,
  switchToSepolia,
  SEPOLIA,
} from "@/lib/web3";

const initialState: WalletState = {
  address: null,
  chainId: null,
  isConnected: false,
  isCorrectNetwork: false,
  isConnecting: false,
  error: null,
};

export function useWallet() {
  const [state, setState] = useState<WalletState>(initialState);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((prev) => ({
        ...prev,
        address: null,
        chainId: null,
        isConnected: false,
        isCorrectNetwork: false,
        error: "No wallet found",
      }));
      return;
    }

    try {
      const [address, chainId] = await Promise.all([
        getCurrentAddress(),
        getCurrentChainId(),
      ]);

      setState((prev) => ({
        ...prev,
        address,
        chainId,
        isConnected: !!address,
        isCorrectNetwork: chainId === SEPOLIA.chainId,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to get wallet state",
      }));
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: "No wallet found. Please install MetaMask.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      await requestAccounts();
      await switchToSepolia();
      await refresh();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err instanceof Error ? err.message : "Failed to connect wallet",
      }));
    }
  }, [refresh]);

  const switchNetwork = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      return;
    }

    try {
      await switchToSepolia();
      await refresh();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to switch network",
      }));
    }
  }, [refresh]);

  const disconnect = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    refresh();

    if (typeof window === "undefined" || !window.ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      setState((prev) => ({
        ...prev,
        address: accs?.[0] ?? null,
        isConnected: !!accs?.[0],
      }));
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [refresh]);

  return {
    ...state,
    connect,
    switchNetwork,
    disconnect,
    refresh,
  };
}
