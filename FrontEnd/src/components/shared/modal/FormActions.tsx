interface FormActionsProps {
    submitLabel: string;
    cancelLabel?: string;
    onCancel: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export default function FormActions({ submitLabel, cancelLabel = "Cancel", onCancel, disabled = false, loading = false }: FormActionsProps) {
    return (
        <div className="flex gap-2 pt-4">
            <button
                type="button"
                onClick={onCancel}
                disabled={disabled}
                className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 text-sm hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={disabled || loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
            >
                {loading ? 'Loading...' : submitLabel}
            </button>
        </div>
    );
}