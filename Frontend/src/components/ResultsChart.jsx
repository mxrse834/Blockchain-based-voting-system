import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#534AB7", "#1D9E75", "#D85A30", "#D4537E", "#378ADD"];

export default function ResultsChart({ results }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={results} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => [`${v} votes`]} />
        <Bar dataKey="vote_count" radius={[6, 6, 0, 0]}>
          {results.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
