import { BrowserProvider, Contract } from "ethers";
import { CONTRACTS, SEPOLIA } from "@/lib/chain";
import { SIMPLE_KITTIES_ABI } from "@/lib/abi";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function getBrowserProvider(): BrowserProvider {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No injected wallet found. Install MetaMask.");
  }
  return new BrowserProvider(window.ethereum);
}

export async function ensureSepolia(): Promise<void> {
  if (!window.ethereum) throw new Error("No injected wallet found.");

  const chainIdHex: string = await window.ethereum.request({ method: "eth_chainId" });

  if (chainIdHex?.toLowerCase() === SEPOLIA.hexChainId) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA.hexChainId }],
    });
  } catch (err: any) {
    // 4902 = chain not added to wallet
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SEPOLIA.hexChainId,
            chainName: "Sepolia",
            nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export async function getSigner() {
  const provider = getBrowserProvider();
  return provider.getSigner();
}

export function getKittiesContractRead(provider: BrowserProvider) {
  return new Contract(CONTRACTS.kitties, SIMPLE_KITTIES_ABI, provider);
}

export async function getKittiesContractWrite() {
  const signer = await getSigner();
  return new Contract(CONTRACTS.kitties, SIMPLE_KITTIES_ABI, signer);
}
