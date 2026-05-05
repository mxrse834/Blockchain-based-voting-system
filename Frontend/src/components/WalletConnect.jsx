import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ onConnected }) {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  async function connect() {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }
    try {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia Chain ID
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia test network",
                nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      onConnected(provider, accounts[0]);
    } catch (e) {
      setError("Wallet connection or network switch rejected.");
    }
  }

  if (address) return <div className="wallet-badge">Connected: {address.slice(0,6)}…{address.slice(-4)}</div>;
  return (
    <div>
      <button id="btn-wallet-connect" className="btn-primary" onClick={connect}>Connect MetaMask</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
