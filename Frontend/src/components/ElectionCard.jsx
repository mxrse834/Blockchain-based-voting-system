import { Calendar, Clock, ArrowRight, Timer } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ElectionCountdown from './ElectionCountdown';

export default function ElectionCard({ election, onAction, actionLabel }) {
  return (
    <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200 group flex flex-col overflow-hidden">
      
      {/* Card Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-indigo-950 dark:text-slate-100 line-clamp-1 pr-4">
            {election.title}
          </h2>
          <div className="flex-shrink-0">
            <StatusBadge status={election.status} />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Starts</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {new Date(election.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ends</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {new Date(election.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Countdown block */}
          {election.status === 'ACTIVE' && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
              <Timer className="w-4 h-4 flex-shrink-0" />
              <ElectionCountdown targetTime={election.end_time} label="Time remaining" />
            </div>
          )}
          {election.status === 'UPCOMING' && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5 text-sm font-bold text-amber-600 dark:text-amber-400 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
              <Timer className="w-4 h-4 flex-shrink-0" />
              <ElectionCountdown targetTime={election.start_time} label="Starts in" />
            </div>
          )}
        </div>
      </div>

      {/* Action button - full width bottom */}
      {onAction && (
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onAction(election.election_id)}
            disabled={election.status === 'UPCOMING'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm"
          >
            {actionLabel || 'View Details'}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
}
