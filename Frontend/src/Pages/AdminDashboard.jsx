import { useState } from "react";
import { connectWallet, startElectionOnChain, endElectionOnChain } from "../services/blockchainService";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      const { signer, address } = await connectWallet();
      setWalletInfo({ signer, address });
      showToast("Admin wallet connected: " + address.slice(0, 6) + "…" + address.slice(-4));
    } catch (err) {
      showToast(err.message || "Wallet connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeployElection = async () => {
    if (!walletInfo) {
      showToast("Connect admin wallet first");
      return;
    }
    setIsLoading(true);
    try {
      const tx = await startElectionOnChain(walletInfo.signer);
      await tx.wait();
      showToast("Election started on-chain ✔");
    } catch (err) {
      showToast(err.reason || err.message || "Failed to start election");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndElection = async () => {
    if (!walletInfo) {
      showToast("Connect admin wallet first");
      return;
    }
    setIsLoading(true);
    try {
      const tx = await endElectionOnChain(walletInfo.signer);
      await tx.wait();
      showToast("Election ended on-chain ✔");
    } catch (err) {
      showToast(err.reason || err.message || "Failed to end election");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast && <div id="toast" className="show">{toast}</div>}

      <div className="shell">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div onClick={() => setTab("home")}>Dashboard</div>
          <div onClick={() => setTab("create")}>Create Election</div>
          <div onClick={() => setTab("voters")}>Voters</div>
        </aside>

        {/* MAIN */}
        <main className="main">

          {tab === "home" && (
            <>
              <h2>Admin Dashboard</h2>
              {!walletInfo ? (
                <button onClick={handleConnectWallet} disabled={isLoading}>
                  {isLoading ? "Connecting…" : "Connect Admin Wallet"}
                </button>
              ) : (
                <span>Wallet: {walletInfo.address.slice(0, 6)}…{walletInfo.address.slice(-4)}</span>
              )}
            </>
          )}

          {tab === "create" && (
            <>
              <button onClick={handleDeployElection} disabled={isLoading}>
                {isLoading ? "Processing…" : "Start Election On-Chain"}
              </button>
              <button onClick={handleEndElection} disabled={isLoading}>
                {isLoading ? "Processing…" : "End Election On-Chain"}
              </button>
            </>
          )}

          {tab === "voters" && (
            <button onClick={() => showToast("Voter Approved")}>
              Approve Voter
            </button>
          )}

        </main>
      </div>
    </>
  );
}