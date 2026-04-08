import { useState, useEffect, useCallback } from "react";

const WALLET_KEY = "w3gh:wallet";

interface WalletState {
  address: string | null;
  chainId: string | null;
  connecting: boolean;
  error: string | null;
}

const BASE_CHAIN_ID = "0x2105";
const BASE_NETWORK = {
  chainId: BASE_CHAIN_ID,
  chainName: "Base",
  rpcUrls: ["https://mainnet.base.org"],
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorerUrls: ["https://basescan.org"],
};

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: localStorage.getItem(WALLET_KEY),
    chainId: null,
    connecting: false,
    error: null,
  });

  const hasProvider = typeof window !== "undefined" && !!(window as any).ethereum;

  const updateChain = useCallback(async () => {
    if (!hasProvider) return;
    try {
      const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
      setState((s) => ({ ...s, chainId }));
    } catch {}
  }, [hasProvider]);

  // Auto-reconnect saved wallet on mount
  useEffect(() => {
    if (!hasProvider || !state.address) return;
    (async () => {
      try {
        const accounts: string[] = await (window as any).ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) {
          localStorage.removeItem(WALLET_KEY);
          setState((s) => ({ ...s, address: null }));
        } else {
          const addr = accounts[0];
          localStorage.setItem(WALLET_KEY, addr);
          setState((s) => ({ ...s, address: addr }));
          updateChain();
        }
      } catch {
        localStorage.removeItem(WALLET_KEY);
        setState((s) => ({ ...s, address: null }));
      }
    })();
  }, [hasProvider, updateChain]);

  // Listen for account & chain changes
  useEffect(() => {
    if (!hasProvider) return;
    const eth = (window as any).ethereum;
    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        localStorage.removeItem(WALLET_KEY);
        setState((s) => ({ ...s, address: null, chainId: null }));
      } else {
        localStorage.setItem(WALLET_KEY, accounts[0]);
        setState((s) => ({ ...s, address: accounts[0] }));
      }
    };
    const onChainChanged = (chainId: string) => {
      setState((s) => ({ ...s, chainId }));
    };
    eth.on("accountsChanged", onAccountsChanged);
    eth.on("chainChanged", onChainChanged);
    return () => {
      eth.removeListener("accountsChanged", onAccountsChanged);
      eth.removeListener("chainChanged", onChainChanged);
    };
  }, [hasProvider]);

  const connect = useCallback(async () => {
    if (!hasProvider) {
      setState((s) => ({ ...s, error: "Please install MetaMask to connect your wallet." }));
      return;
    }
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const addr = accounts[0];
      localStorage.setItem(WALLET_KEY, addr);
      setState((s) => ({ ...s, address: addr, connecting: false }));
      await updateChain();
    } catch (err: any) {
      setState((s) => ({ ...s, connecting: false, error: err?.message || "Connection rejected" }));
    }
  }, [hasProvider, updateChain]);

  const disconnect = useCallback(() => {
    localStorage.removeItem(WALLET_KEY);
    setState({ address: null, chainId: null, connecting: false, error: null });
  }, []);

  const switchToBase = useCallback(async () => {
    if (!hasProvider) return;
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_CHAIN_ID }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BASE_NETWORK],
        });
      }
    }
  }, [hasProvider]);

  const isBaseNetwork = state.chainId === BASE_CHAIN_ID;

  return {
    address: state.address,
    shortAddress: state.address ? shortenAddress(state.address) : null,
    chainId: state.chainId,
    isBaseNetwork,
    connecting: state.connecting,
    error: state.error,
    hasProvider,
    connect,
    disconnect,
    switchToBase,
  };
}
