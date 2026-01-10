import { useState } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    reasons?: string[];
    allowCustomReason?: boolean;
    confirmText?: string;
}

const defaultReasons = ["No longer needed", "Found a better alternative", "Mistake", "Other"];

const ConfirmModal = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    reasons = defaultReasons, 
    allowCustomReason = true,
    confirmText = "Cancel Tournament" 
}: ConfirmModalProps) => {
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200">
            {/* Backdrop click handler */}
            <div
                className="absolute inset-0 bg-transparent"
                onClick={handleCancel}
            />
            
            <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center relative animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{message}</p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3 text-left">
                        Please select a reason:
                    </label>

                    <div className="space-y-2 mb-4">
                        {reasons.map((reason) => (
                            <label key={reason}
                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
                                    ${selectedReason === reason 
                                        ? "bg-primary/5 border-primary/50" 
                                        : "bg-muted/30 border-transparent hover:bg-muted/50 hover:border-border"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="mr-3 accent-primary h-4 w-4"
                                />
                                <span className={`text-sm ${selectedReason === reason ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                    {reason}
                                </span>
                            </label>
                        ))}
                    </div>

                    {showCustomInput && (
                        <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
                            <label className="block text-sm text-muted-foreground mb-2 text-left">
                                Please specify:
                            </label>
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Enter your reason here..."
                                className="w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-input resize-none transition-shadow"
                                rows={3}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex-1 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isOtherSelected && !customReason.trim()}
                        className="px-6 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 font-medium shadow-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;