import { BrowserProvider, Contract, JsonRpcProvider, type Signer } from "ethers";
import { CONTRACTS, SEPOLIA, SEPOLIA_RPC_URL, EXPLORER_URL } from "./chain";
import { SIMPLE_KITTIES_ABI } from "./abi";

export { SEPOLIA, EXPLORER_URL };

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export type WalletState = {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  error: string | null;
};

export type Kitty = {
  id: number;
  owner: string;
  genes: bigint;
  birthTime: bigint;
  momId: number;
  dadId: number;
  generation: number;
};

export type KittyView = {
  id: number;
  owner: string;
  genes: string;
  birthTime: Date;
  momId: number;
  dadId: number;
  generation: number;
};

class Web3Error extends Error {
  constructor(
    message: string,
    public code?: number
  ) {
    super(message);
    this.name = "Web3Error";
  }
}

function getInjectedProvider(): BrowserProvider {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Web3Error("No injected wallet found. Please install MetaMask.");
  }
  return new BrowserProvider(window.ethereum);
}

export async function getWalletProvider(): Promise<BrowserProvider> {
  const provider = getInjectedProvider();
  return provider;
}

export async function getSigner(): Promise<Signer> {
  const provider = getInjectedProvider();
  const signer = await provider.getSigner();
  if (!signer) {
    throw new Web3Error("Failed to get signer. Please unlock your wallet.");
  }
  return signer;
}

export async function getCurrentChainId(): Promise<number> {
  const provider = getInjectedProvider();
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

export async function getCurrentAddress(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  }) as string[];
  return accounts?.[0] ?? null;
}

export async function requestAccounts(): Promise<string[]> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Web3Error("No wallet found. Please install MetaMask.");
  }
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  }) as string[];
  if (!accounts || accounts.length === 0) {
    throw new Web3Error("No accounts found. Please unlock your wallet.");
  }
  return accounts;
}

export async function switchToSepolia(): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Web3Error("No wallet found.");
  }

  const provider = getInjectedProvider();
  const network = await provider.getNetwork();
  const currentChainId = Number(network.chainId);

  if (currentChainId === SEPOLIA.chainId) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA.hexChainId }],
    });
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SEPOLIA.hexChainId,
            chainName: "Sepolia Testnet",
            nativeCurrency: {
              name: "Sepolia ETH",
              symbol: "SEP",
              decimals: 18,
            },
            rpcUrls: [SEPOLIA_RPC_URL],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } else if (error.code === 4001) {
      throw new Web3Error("User rejected the network switch request.");
    } else {
      throw new Web3Error(error.message ?? "Failed to switch network.");
    }
  }
}

export function getReadContract(provider: BrowserProvider | JsonRpcProvider): Contract {
  return new Contract(CONTRACTS.kitties, SIMPLE_KITTIES_ABI, provider);
}

export async function getWriteContract(): Promise<Contract> {
  const signer = await getSigner();
  return new Contract(CONTRACTS.kitties, SIMPLE_KITTIES_ABI, signer);
}

export async function fetchKitty(
  contract: Contract,
  tokenId: number
): Promise<Kitty | null> {
  try {
    const [genes, birthTime, momId, dadId, generation] = await contract.kitties(tokenId);
    const owner = await contract.ownerOf(tokenId);
    
    return {
      id: tokenId,
      owner,
      genes,
      birthTime,
      momId: Number(momId),
      dadId: Number(dadId),
      generation: Number(generation),
    };
  } catch {
    return null;
  }
}

export async function fetchAllKitties(
  contract: Contract,
  totalSupply: number
): Promise<KittyView[]> {
  const kitties: KittyView[] = [];
  
  for (let id = 1; id <= totalSupply; id++) {
    const kitty = await fetchKitty(contract, id);
    if (kitty) {
      kitties.push({
        id: kitty.id,
        owner: kitty.owner,
        genes: kitty.genes.toString(),
        birthTime: new Date(Number(kitty.birthTime) * 1000),
        momId: kitty.momId,
        dadId: kitty.dadId,
        generation: kitty.generation,
      });
    }
  }
  
  return kitties;
}

export async function getTotalSupply(contract: Contract): Promise<number> {
  try {
    const counter = await contract._tokenIdCounter();
    return Number(counter) - 1;
  } catch {
    return 0;
  }
}

export async function breedKitty(
  contract: Contract,
  momId: number,
  dadId: number
): Promise<string> {
  const tx = await contract.breed(momId, dadId);
  return tx.hash;
}

export async function waitForTransaction(
  provider: BrowserProvider,
  txHash: string
): Promise<boolean> {
  const receipt = await provider.waitForTransaction(txHash);
  return receipt?.status === 1;
}

export function shortAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
