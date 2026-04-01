import { useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
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

          {tab === "home" && <h2>Admin Dashboard</h2>}

          {tab === "create" && (
            <button onClick={() => showToast("Election Created")}>
              Deploy Election
            </button>
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