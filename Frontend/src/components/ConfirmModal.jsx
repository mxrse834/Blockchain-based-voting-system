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
      <div className="relative w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-premium p-6 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          danger
            ? 'bg-red-100 dark:bg-red-950/50'
            : 'bg-brand-100 dark:bg-brand-950/50'
        }`}>
          <Icon className={`w-6 h-6 ${
            danger
              ? 'text-red-600 dark:text-red-400'
              : 'text-brand-600 dark:text-brand-400'
          }`} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">
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
