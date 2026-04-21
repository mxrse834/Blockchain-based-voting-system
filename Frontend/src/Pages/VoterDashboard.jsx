import { useState } from "react";
import { connectWallet, castVoteOnChain, checkHasVoted } from "../services/blockchainService";
import "./VoterDashboard.css";

export default function VoterDashboard() {
  const [tab, setTab] = useState("home");
  const [votes, setVotes] = useState({});
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const vote = (id, choice) => {
    setVotes({ ...votes, [id]: choice });
  };

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      const { signer, address } = await connectWallet();
      setWalletInfo({ signer, address });
      showToast("Wallet connected: " + address.slice(0, 6) + "…" + address.slice(-4));
    } catch (err) {
      showToast(err.message || "Wallet connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const castVote = async (id) => {
    if (!votes[id]) return showToast("Select option first");

    if (!walletInfo) {
      showToast("Connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Check if already voted on-chain
      const alreadyVoted = await checkHasVoted(walletInfo.signer.provider, walletInfo.address);
      if (alreadyVoted) {
        showToast("You have already voted on-chain");
        setVotes({ ...votes, [id + "_done"]: true });
        return;
      }

      // candidateIndex: 0 for "yes", 1 for "no" (maps to contract candidates array)
      const candidateIndex = votes[id] === "yes" ? 0 : 1;
      const tx = await castVoteOnChain(walletInfo.signer, candidateIndex);
      await tx.wait();

      setVotes({ ...votes, [id + "_done"]: true });
      showToast("Vote recorded on blockchain ✔");
    } catch (err) {
      showToast(err.reason || err.message || "Vote failed");
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
          <div onClick={() => setTab("home")}>Home</div>
          <div onClick={() => setTab("elections")}>Elections</div>
        </aside>

        {/* MAIN */}
        <main className="main">

          {tab === "home" && <h2>Welcome</h2>}

          {tab === "elections" && (
            <div className="proposal">

              {!walletInfo && (
                <button onClick={handleConnectWallet} disabled={isLoading}>
                  {isLoading ? "Connecting…" : "Connect Wallet"}
                </button>
              )}

              {walletInfo && (
                <span>Wallet: {walletInfo.address.slice(0, 6)}…{walletInfo.address.slice(-4)}</span>
              )}

              <div
                className={`vote-opt ${votes.p1 === "yes" && "sel"}`}
                onClick={() => vote("p1", "yes")}
              >
                Yes
              </div>

              <div
                className={`vote-opt ${votes.p1 === "no" && "sel"}`}
                onClick={() => vote("p1", "no")}
              >
                No
              </div>

              {!votes.p1_done ? (
                <button onClick={() => castVote("p1")} disabled={isLoading}>
                  {isLoading ? "Processing…" : "Vote"}
                </button>
              ) : (
                <span>✔ Done</span>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
}