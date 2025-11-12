interface ConfirmModalProps {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmTeamModal({ title = "Confirm", message, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur">
            <div className="bg-neutral-900 rounded-xl shadow-xl max-w-sm w-full p-6 text-white">
                {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
                <p className="mb-6 text-sm">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}
