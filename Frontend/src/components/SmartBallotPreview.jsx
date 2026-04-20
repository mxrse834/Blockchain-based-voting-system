import { motion, AnimatePresence } from "framer-motion";
import { Lock, CodeXml, Zap, UserCircle2, Info, ShieldCheck } from "lucide-react";

export default function SmartBallotPreview({ activeTab }) {
  const candidates = [
    { id: 1, name: "Candidate A", role: "Board Director" },
    { id: 2, name: "Candidate B", role: "Treasurer" },
    { id: 3, name: "Candidate C", role: "Secretary" },
  ];

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-xl flex flex-col p-6 md:p-8 min-h-[320px] justify-center">
      
      {/* Dynamic Ballot Section */}
      <div className="w-full max-w-md mx-auto text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "Plurality (First-Past-the-Post)" ? (
              <div className="space-y-3">
                {candidates.map((c) => (
                  <motion.div whileHover={{ scale: 1.02 }} key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-orange-500/50 gap-4">
                    <div className="flex items-center gap-3">
                      <UserCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.role}</p>
                      </div>
                    </div>
                    <div className="group relative">
                      <button className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-orange-500 dark:bg-slate-700 dark:hover:bg-orange-500 text-white font-semibold text-sm rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                        Select
                      </button>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-950 text-white text-[10px] font-bold px-2 py-1 rounded w-max shadow-lg pointer-events-none before:content-[''] before:absolute before:bottom-[-4px] before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-indigo-950">
                        MetaMask Required
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
                <div className="flex flex-col items-center text-center justify-center space-y-4 py-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg relative z-10">
                      <Info className="w-8 h-8 text-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-950 dark:text-slate-100">In Development</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                      Advanced voting logic (v2.0) is currently in development. Currently supporting secure Plurality voting via MetaMask.
                    </p>
                  </div>
                </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Tech Specs Footer */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-lg p-3 mt-6 flex flex-wrap items-center justify-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Signed via MetaMask</span>
          </div>
          <div className="flex items-center gap-2">
            <CodeXml className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Solidity v0.8.20</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gas Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
}