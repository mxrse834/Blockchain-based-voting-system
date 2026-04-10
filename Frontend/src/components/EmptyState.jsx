import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm mt-4">
      <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-2">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button onClick={action} className="btn-primary">
          {actionLabel || 'Take action'}
        </button>
      )}
    </div>
  );
}
