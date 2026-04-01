import { useState } from "react";
import "./VoterDashboard.css";

export default function VoterDashboard() {
  const [tab, setTab] = useState("home");
  const [votes, setVotes] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const vote = (id, choice) => {
    setVotes({ ...votes, [id]: choice });
  };

  const castVote = (id) => {
    if (!votes[id]) return showToast("Select option first");

    setVotes({ ...votes, [id + "_done"]: true });
    showToast("Vote recorded");
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
                <button onClick={() => castVote("p1")}>
                  Vote
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