import { useState } from "react";
import { X, Landmark, Smartphone, Loader2 } from "lucide-react";
import type { SavePayoutMethodPayload } from "../../../features/shared/wallet/walletTypes"; 

export const AddPaymentMethodModal = ({ 
    onClose, 
    onSave 
}: { 
    onClose: () => void, 
    onSave: (data: SavePayoutMethodPayload) => Promise<void> 
}) => {
    const [type, setType] = useState<'bank' | 'upi'>('bank');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        ifsc: '',
        upiId: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let payload: SavePayoutMethodPayload;

            if (type === 'bank') {
                payload = {
                    type: 'bank',
                    name: formData.bankName,
                    accountNumber: formData.accountNumber,
                    ifsc: formData.ifsc.toUpperCase(),
                };
            } else {
                payload = {
                    type: 'upi',
                    name: 'UPI ID',
                    upiId: formData.upiId,
                };
            }

            await onSave(payload);
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                    <h3 className="text-lg font-bold text-foreground">Add Payout Method</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Toggle */}
                    <div className="flex bg-muted p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('bank')}
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'bank' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                        >
                            <Landmark size={16} /> Bank
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('upi')}
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'upi' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                        >
                            <Smartphone size={16} /> UPI
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        {type === 'bank' ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Bank Name</label>
                                    <input
                                        placeholder="e.g. HDFC Bank"
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none text-foreground"
                                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Account Number</label>
                                    <input
                                        type="password" // For security during entry
                                        placeholder="Enter full account number"
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none text-foreground"
                                        onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">IFSC Code</label>
                                    <input
                                        placeholder="HDFC0001234"
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none text-foreground uppercase"
                                        onChange={e => setFormData({ ...formData, ifsc: e.target.value })}
                                        disabled={isSubmitting}
                                        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                                        title="Enter a valid 11-digit IFSC code"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">UPI ID</label>
                                <input
                                    placeholder="username@okbank"
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none text-foreground"
                                    onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                                    disabled={isSubmitting}
                                    pattern="^[\w.-]+@[\w.-]+$"
                                    title="Enter a valid UPI ID (e.g., name@bank)"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Saving Account...
                            </>
                        ) : "Confirm & Save"}
                    </button>
                </form>
            </div>
        </div>
    );
};