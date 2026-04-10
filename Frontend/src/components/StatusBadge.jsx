import { Circle } from 'lucide-react';

const config = {
  ACTIVE: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'text-emerald-500',
    ring: 'ring-emerald-500/20 dark:ring-emerald-400/20',
  },
  UPCOMING: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'text-amber-500',
    ring: 'ring-amber-500/20 dark:ring-amber-400/20',
  },
  CLOSED: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'text-slate-400',
    ring: 'ring-slate-500/30 dark:ring-slate-400/30',
  },
};

export default function StatusBadge({ status }) {
  const s = config[status] || config.CLOSED;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ring-1 ${s.bg} ${s.text} ${s.ring}`}
    >
      <Circle className={`w-1.5 h-1.5 fill-current ${s.dot}`} />
      {status}
    </span>
  );
}
