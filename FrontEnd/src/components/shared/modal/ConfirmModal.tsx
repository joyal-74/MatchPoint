import { useState } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    reasons?: string[];
    allowCustomReason?: boolean;
}

const reason = ["No longer needed", "Found a better alternative", "Mistake", "Other"];

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, reasons = reason, allowCustomReason = true }: ConfirmModalProps) => {
    const [selectedReason, setSelectedReason] = useState<string>(reasons[0]);
    const [customReason, setCustomReason] = useState<string>("");

    if (!isOpen) return null;

    const isOtherSelected = selectedReason === "Other";
    const showCustomInput = allowCustomReason && isOtherSelected;

    const handleConfirm = () => {
        const finalReason = isOtherSelected ? customReason : selectedReason;
        onConfirm(finalReason);
        // Reset state
        setCustomReason("");
        setSelectedReason(reasons[0]);
    };

    const handleCancel = () => {
        // Reset state
        setCustomReason("");
        setSelectedReason(reasons[0]);
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleCancel}
            />
            <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center backdrop-blur-2xl">
                <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
                <p className="text-sm text-neutral-400 mb-4">{message}</p>

                <div className="mb-4">
                    <label className="block text-sm text-neutral-300 mb-3 text-left">
                        Please select a reason:
                    </label>

                    <div className="space-y-2 mb-4">
                        {reasons.map((reason) => (
                            <label key={reason}
                                className="flex items-center p-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 cursor-pointer transition"
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="mr-3 text-green-500 focus:ring-green-500"
                                />
                                <span className="text-white text-sm">{reason}</span>
                            </label>
                        ))}
                    </div>

                    {showCustomInput && (
                        <div className="mt-3 p-3 rounded-lg bg-neutral-800">
                            <label className="block text-sm text-neutral-300 mb-2 text-left">
                                Please specify:
                            </label>
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Enter your reason here..."
                                className="w-full px-3 py-2 rounded-lg bg-neutral-700 text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                                rows={3}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 text-sm rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isOtherSelected && !customReason.trim()}
                        className="px-6 py-2 text-sm rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed text-white transition flex-1"
                    >
                        Cancel Tournament
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;