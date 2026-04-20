export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-slate-100/50 dark:bg-[#1A1F36]/40 border border-slate-200 dark:border-gray-800/50 rounded-xl p-6 flex flex-col h-[250px]">
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-gray-700/30 rounded mb-6"></div>
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-gray-700/30 rounded mb-3"></div>
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-gray-700/30 rounded mb-2"></div>
      <div className="flex-grow"></div>
      <div className="h-10 w-full mt-4 bg-slate-200 dark:bg-gray-700/30 rounded"></div>
    </div>
  );
}
