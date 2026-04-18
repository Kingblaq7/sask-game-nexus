import { JsonRpcProvider, BrowserProvider, formatEther, parseEther, isAddress } from "ethers";

export const BASE_CHAIN_ID = 8453;
export const BASE_CHAIN_ID_HEX = "0x2105";
export const BASE_RPC_URL = "https://mainnet.base.org";
export const BASE_EXPLORER = "https://basescan.org";

/** Read-only provider pointed at Base mainnet — no wallet required. */
export const baseProvider = new JsonRpcProvider(BASE_RPC_URL, {
  chainId: BASE_CHAIN_ID,
  name: "base",
});

/** Returns a wallet-backed provider (BrowserProvider) if MetaMask/injected wallet is available. */
export function getBrowserProvider(): BrowserProvider | null {
  const eth = (typeof window !== "undefined" ? (window as any).ethereum : null) as any;
  if (!eth) return null;
  return new BrowserProvider(eth);
}

export interface ContractReadResult {
  address: string;
  isContract: boolean;
  balanceEth: string;
  bytecodeSize: number;
  blockNumber: number;
}

/** Reads on-chain state for any address on Base: code presence, ETH balance, latest block. */
export async function readContractState(address: string): Promise<ContractReadResult> {
  if (!isAddress(address)) throw new Error("Invalid address");
  const [code, balance, blockNumber] = await Promise.all([
    baseProvider.getCode(address),
    baseProvider.getBalance(address),
    baseProvider.getBlockNumber(),
  ]);
  // bytecode is "0x" when address has no contract code
  const hex = code.startsWith("0x") ? code.slice(2) : code;
  const bytecodeSize = hex.length / 2;
  return {
    address,
    isContract: bytecodeSize > 0,
    balanceEth: formatEther(balance),
    bytecodeSize,
    blockNumber,
  };
}

export interface SendTxParams {
  to: string;
  /** ETH amount as a decimal string, e.g. "0.001". Defaults to "0". */
  valueEth?: string;
  /** Optional hex calldata. */
  data?: string;
}

export interface SendTxResult {
  hash: string;
  explorerUrl: string;
}

/**
 * Sends a transaction via the user's connected wallet on Base.
 * Throws if no wallet, wrong network, or user rejects.
 */
export async function sendTransaction(params: SendTxParams): Promise<SendTxResult> {
  const provider = getBrowserProvider();
  if (!provider) throw new Error("No wallet detected. Please install MetaMask.");

  const network = await provider.getNetwork();
  if (Number(network.chainId) !== BASE_CHAIN_ID) {
    throw new Error("Please switch your wallet to Base mainnet.");
  }

  if (!isAddress(params.to)) throw new Error("Invalid recipient address");

  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({
    to: params.to,
    value: parseEther(params.valueEth ?? "0"),
    data: params.data,
  });

  return {
    hash: tx.hash,
    explorerUrl: `${BASE_EXPLORER}/tx/${tx.hash}`,
  };
}
