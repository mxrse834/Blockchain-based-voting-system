import { Calendar, Clock, ArrowRight, Timer } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ElectionCountdown from './ElectionCountdown';

export default function ElectionCard({ election, onAction, actionLabel }) {
  return (
    <div className="group relative bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      {/* Status badge - top right */}
      <div className="absolute top-4 right-4 z-10">
        <StatusBadge status={election.status} />
      </div>

      {/* Card content */}
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 pr-24 leading-snug">
          {election.title}
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-surface-500 dark:text-surface-400">
            <Calendar className="w-4 h-4 text-surface-400 dark:text-surface-500 flex-shrink-0" />
            <span>Start: {new Date(election.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-surface-500 dark:text-surface-400">
            <Clock className="w-4 h-4 text-surface-400 dark:text-surface-500 flex-shrink-0" />
            <span>End: {new Date(election.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Countdown */}
          {election.status === 'ACTIVE' && (
            <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <Timer className="w-4 h-4 flex-shrink-0" />
              <ElectionCountdown targetTime={election.end_time} label="Time remaining" />
            </div>
          )}
          {election.status === 'UPCOMING' && (
            <div className="flex items-center gap-2.5 text-sm font-medium text-amber-600 dark:text-amber-400">
              <Timer className="w-4 h-4 flex-shrink-0" />
              <ElectionCountdown targetTime={election.start_time} label="Starts in" />
            </div>
          )}
        </div>
      </div>

      {/* Action button - full width bottom */}
      {onAction && (
        <div className="border-t border-surface-100 dark:border-surface-700/60">
          <button
            onClick={() => onAction(election.election_id)}
            disabled={election.status === 'UPCOMING'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
              text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30
              group-hover:text-brand-700 dark:group-hover:text-brand-300"
          >
            {actionLabel || 'View Details'}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
}
