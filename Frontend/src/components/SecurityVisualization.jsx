import { ShieldCheck } from "lucide-react";

export default function SecurityVisualization() {
  const nodes = [
    { id: 1, top: "20%", left: "15%", delay: "0s" },
    { id: 2, top: "15%", left: "50%", delay: "1s" },
    { id: 3, top: "25%", left: "80%", delay: "2s" },
    { id: 4, top: "50%", left: "85%", delay: "0.5s" },
    { id: 5, top: "75%", left: "75%", delay: "1.5s" },
    { id: 6, top: "85%", left: "50%", delay: "2.5s" },
    { id: 7, top: "70%", left: "20%", delay: "0.8s" },
    { id: 8, top: "50%", left: "10%", delay: "1.8s" },
  ];

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#030712] border border-indigo-500/20">
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1) translate(-50%, -50%); }
          50% { opacity: 1; transform: scale(1.5) translate(-33%, -33%); }
        }
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-shimmer {
          stroke-dasharray: 4 4;
          animation: shimmer 2s linear infinite;
        }
        @keyframes center-pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(249,115,22,0.6)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 16px rgba(249,115,22,1)); transform: scale(1.05); }
        }
        .animate-center-pulse {
          animation: center-pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* SVG Lines Connecting Nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node) => (
          <line
            key={`line-${node.id}`}
            x1="50%"
            y1="50%"
            x2={node.left}
            y2={node.top}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-indigo-400/30 animate-shimmer"
            style={{ animationDelay: node.delay }}
          />
        ))}
      </svg>

      {/* Central Shield */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full" />
          <div className="w-20 h-20 bg-indigo-950/90 border border-indigo-500/40 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] relative z-10">
            <ShieldCheck className="w-10 h-10 text-orange-500 animate-center-pulse" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Scattered Animated Nodes */}
      {nodes.map((node) => (
        <div
          key={`node-${node.id}`}
          className="absolute w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)] animate-breathe"
          style={{
            top: node.top,
            left: node.left,
            animationDelay: node.delay,
            transformOrigin: 'top left'
          }}
        >
          <div className="absolute inset-0 bg-white/50 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: node.delay }} />
        </div>
      ))}

      {/* Trust Badges */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          SOC2 Compliant
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
          E2E Encrypted
        </div>
      </div>
    </div>
  );
}