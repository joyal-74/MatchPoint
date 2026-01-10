interface FormActionsProps {
    submitLabel: string;
    cancelLabel?: string;
    onCancel: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export default function FormActions({ 
    submitLabel, 
    cancelLabel = "Cancel", 
    onCancel, 
    disabled = false, 
    loading = false 
}: FormActionsProps) {
    return (
        <div className="flex gap-3 pt-6 mt-4 border-t border-border">
            <button
                type="button"
                onClick={onCancel}
                disabled={disabled}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg border border-border text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
                {cancelLabel}
            </button>
            
            <button
                type="submit"
                disabled={disabled || loading}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm shadow-primary/20"
            >
                {loading ? 'Loading...' : submitLabel}
            </button>
        </div>
    );
}