import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
  icon: Icon = AlertTriangle,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 shadow-sm border ${
          danger
            ? 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800'
            : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800'
        }`}>
          <Icon className={`w-6 h-6 ${
            danger
              ? 'text-red-600 dark:text-red-400'
              : 'text-indigo-600 dark:text-indigo-400'
          }`} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
