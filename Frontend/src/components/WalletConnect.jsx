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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      onConnected(provider, accounts[0]);
    } catch (e) {
      setError("Wallet connection rejected.");
    }
  }

  if (address) return <div className="wallet-badge">Connected: {address.slice(0,6)}…{address.slice(-4)}</div>;
  return (
    <div>
      <button className="btn-primary" onClick={connect}>Connect MetaMask</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
