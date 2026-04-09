import { Circle } from 'lucide-react';

const config = {
  ACTIVE: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'text-emerald-500',
    ring: 'ring-emerald-500/20 dark:ring-emerald-400/20',
  },
  UPCOMING: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'text-amber-500',
    ring: 'ring-amber-500/20 dark:ring-amber-400/20',
  },
  CLOSED: {
    bg: 'bg-surface-100 dark:bg-surface-800',
    text: 'text-surface-600 dark:text-surface-400',
    dot: 'text-surface-400',
    ring: 'ring-surface-500/10 dark:ring-surface-400/10',
  },
};

export default function StatusBadge({ status }) {
  const s = config[status] || config.CLOSED;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}
    >
      <Circle className={`w-2 h-2 fill-current ${s.dot}`} />
      {status}
    </span>
  );
}
