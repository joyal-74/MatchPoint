interface ConfirmModalProps {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string; 
}

export default function ConfirmTeamModal({ 
    title = "Confirm", 
    message, 
    onConfirm, 
    onCancel,
    confirmText = "Leave"
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm transition-all duration-200">
            <div className="absolute inset-0" onClick={onCancel} />

            <div className="relative bg-card text-card-foreground border border-border rounded-xl shadow-lg max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                {title && <h2 className="text-lg font-semibold mb-2 text-foreground">{title}</h2>}
                <p className="mb-6 text-sm text-muted-foreground">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors font-medium text-sm shadow-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}