import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500 animate-spin mb-4" />
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20 w-full">
      {content}
    </div>
  );
}
