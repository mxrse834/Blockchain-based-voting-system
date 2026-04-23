import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ onConnected, walletAddress }) {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  async function connect() {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      onConnected(provider, accounts[0]);
    } catch (e) {
      setError("Wallet connection rejected.");
    }
  }

  const activeAddress = walletAddress || address;

  if (activeAddress) return <div className="wallet-badge">Connected: {activeAddress.slice(0,6)}…{activeAddress.slice(-4)}</div>;
  return (
    <div>
      <button id="btn-wallet-connect" className="btn-primary" onClick={connect}>Connect MetaMask</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
