import React, { useState } from "react";
import { X, Landmark, CreditCard, AlertCircle, Plus } from "lucide-react";
import type { PayoutMethod, SavePayoutMethodPayload } from "../../../features/manager/financials/financialTypes";

interface WithdrawalModalProps {
    methods: PayoutMethod[];
    balance: number;
    onConfirm: (payoutData: string | SavePayoutMethodPayload, amount: number) => Promise<void>;
    onClose: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ 
    methods, 
    balance, 
    onConfirm, 
    onClose 
}) => {
    const [selectedId, setSelectedId] = useState<string>("");
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for new method
    const [newMethodType, setNewMethodType] = useState<'bank' | 'upi'>('bank');
    const [bankDetails, setBankDetails] = useState({ name: '', accountNumber: '', ifsc: '' });
    const [upiDetails, setUpiDetails] = useState({ name: '', upiId: '' });

    const numAmount = Number(amount);
    const isValidAmount = numAmount >= 100 && numAmount <= balance;
    
    // Validation for "Add New" forms
    const isNewMethodValid = newMethodType === 'bank' 
        ? (bankDetails.name && bankDetails.accountNumber && bankDetails.ifsc)
        : (upiDetails.name && upiDetails.upiId);

    const canSubmit = (isAddingNew ? isNewMethodValid : selectedId) && isValidAmount && !isSubmitting;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        try {
            if (isAddingNew) {
                const payload: SavePayoutMethodPayload = newMethodType === 'bank' 
                    ? { type: 'bank', ...bankDetails }
                    : { type: 'upi', ...upiDetails };
                await onConfirm(payload, numAmount);
            } else {
                await onConfirm(selectedId, numAmount);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-card border border-border w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground">Withdraw Funds</h2>
                            <p className="text-muted-foreground text-xs font-medium mt-1">
                                {isAddingNew ? "Enter new payment details" : "Select a saved account"}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Toggle between saved and new */}
                        {!isAddingNew ? (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Receive Money Via</label>
                                <div className="grid gap-3">
                                    {methods.map((m) => (
                                        <button
                                            key={m._id}
                                            onClick={() => setSelectedId(m._id)}
                                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedId === m._id ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === m._id ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                                                    {m.type === 'bank' ? <Landmark size={18} /> : <CreditCard size={18} />}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-foreground">{m.type === 'bank' ? 'Bank Account' : 'UPI ID'}</p>
                                                    <p className="text-[10px] font-medium text-muted-foreground">{m.detail}</p>
                                                </div>
                                            </div>
                                            {selectedId === m._id && <div className="w-2 h-2 bg-primary rounded-full" />}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => setIsAddingNew(true)}
                                        className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                            <Plus size={18} />
                                        </div>
                                        <p className="text-sm font-bold text-muted-foreground group-hover:text-primary">Add New Method</p>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Add New Method Form */
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="flex gap-2 p-1 bg-muted rounded-xl">
                                    <button 
                                        onClick={() => setNewMethodType('bank')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newMethodType === 'bank' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                                    >Bank</button>
                                    <button 
                                        onClick={() => setNewMethodType('upi')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newMethodType === 'upi' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                                    >UPI</button>
                                </div>

                                {newMethodType === 'bank' ? (
                                    <div className="space-y-3">
                                        <input placeholder="Account Holder Name" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none focus:ring-2 ring-primary/20" value={bankDetails.name} onChange={e => setBankDetails({...bankDetails, name: e.target.value})} />
                                        <input placeholder="Account Number" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} />
                                        <input placeholder="IFSC Code" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={bankDetails.ifsc} onChange={e => setBankDetails({...bankDetails, ifsc: e.target.value})} />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <input placeholder="Name" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={upiDetails.name} onChange={e => setUpiDetails({...upiDetails, name: e.target.value})} />
                                        <input placeholder="UPI ID (e.g. user@okaxis)" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={upiDetails.upiId} onChange={e => setUpiDetails({...upiDetails, upiId: e.target.value})} />
                                    </div>
                                )}
                                <button onClick={() => setIsAddingNew(false)} className="text-[10px] font-bold text-primary underline">Back to saved accounts</button>
                            </div>
                        )}

                        {/* Amount Input */}
                        <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</label>
                                <span className="text-[10px] font-bold text-primary">Balance: ₹{balance}</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-muted border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl p-4 pl-8 font-black text-xl transition-all outline-none" placeholder="0" />
                            </div>
                            {amount && !isValidAmount && (
                                <div className="flex items-center gap-2 text-destructive text-[10px] font-bold ml-1">
                                    <AlertCircle size={12} />
                                    {numAmount < 100 ? "Minimum withdrawal is ₹100" : "Insufficient balance"}
                                </div>
                            )}
                        </div>

                        <button onClick={handleSubmit} disabled={!canSubmit} className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-20 shadow-lg shadow-primary/20">
                            {isSubmitting ? "Processing..." : "Confirm & Withdraw"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};