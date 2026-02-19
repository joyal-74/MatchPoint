import React, { useState } from "react";
import { X, Landmark, CreditCard, AlertCircle, Plus, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import type { PayoutMethod, SavePayoutMethodPayload } from "../../../features/shared/wallet/walletTypes";

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
    // UI State
    const [step, setStep] = useState<'select' | 'review' | 'success'>('select');
    const [selectedId, setSelectedId] = useState<string>("");
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New Method Form State
    const [newMethodType, setNewMethodType] = useState<'bank' | 'upi'>('bank');
    const [bankDetails, setBankDetails] = useState({ name: '', accountNumber: '', ifsc: '' });
    const [upiDetails, setUpiDetails] = useState({ name: '', upiId: '' });

    // Constants & Helpers
    const numAmount = Number(amount);
    const isValidAmount = numAmount >= 100 && numAmount <= balance;
    const isNewMethodValid = newMethodType === 'bank'
        ? (bankDetails.name && bankDetails.accountNumber && bankDetails.ifsc)
        : (upiDetails.name && upiDetails.upiId);

    const canProceedToReview = (isAddingNew ? isNewMethodValid : selectedId) && isValidAmount;

    // Handlers
    const handleProceedToReview = () => {
        if (canProceedToReview) setStep('review');
    };

    const handleFinalSubmit = async () => {
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
            setStep('success');
        } catch (error) {
            console.error("Withdrawal Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedDetails = () => {
        if (isAddingNew) {
            return newMethodType === 'bank' ? bankDetails.accountNumber : upiDetails.upiId;
        }
        const method = methods.find(m => m._id === selectedId);
        return method ? method.detail : "";
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-card border border-border w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300">
                <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Header: Hide if Success */}
                    {step !== 'success' && (
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                {step === 'review' && (
                                    <button onClick={() => setStep('select')} className="p-2 hover:bg-muted rounded-full transition-colors">
                                        <ChevronLeft size={20} />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-foreground">
                                        {step === 'review' ? 'Review' : 'Withdraw'}
                                    </h2>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    {/* STEP 1: SELECT & AMOUNT */}
                    {step === 'select' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            {!isAddingNew ? (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Receive Via</label>
                                    <div className="grid gap-3">
                                        {methods.map((m) => (
                                            <button
                                                key={m._id}
                                                onClick={() => setSelectedId(m._id)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedId === m._id ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"}`}
                                            >
                                                <div className="flex items-center gap-3 text-left">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === m._id ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                                                        {m.type === 'bank' ? <Landmark size={18} /> : <CreditCard size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{m.type === 'bank' ? 'Bank Account' : 'UPI'}</p>
                                                        <p className="text-[10px] font-medium text-muted-foreground">{m.detail}</p>
                                                    </div>
                                                </div>
                                                {selectedId === m._id && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                                            </button>
                                        ))}
                                        <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                                            <Plus size={18} /> <span className="text-sm font-bold">Add New Account</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in zoom-in-95">
                                    <div className="flex gap-2 p-1 bg-muted rounded-xl">
                                        {(['bank', 'upi'] as const).map(type => (
                                            <button key={type} onClick={() => setNewMethodType(type)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all uppercase ${newMethodType === type ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}>{type}</button>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        {newMethodType === 'bank' ? (
                                            <>
                                                <input placeholder="Account Name" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={bankDetails.name} onChange={e => setBankDetails({...bankDetails, name: e.target.value})} />
                                                <input placeholder="Account Number" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} />
                                                <input placeholder="IFSC Code" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={bankDetails.ifsc} onChange={e => setBankDetails({...bankDetails, ifsc: e.target.value})} />
                                            </>
                                        ) : (
                                            <>
                                                <input placeholder="Full Name" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={upiDetails.name} onChange={e => setUpiDetails({...upiDetails, name: e.target.value})} />
                                                <input placeholder="UPI ID (e.g. user@bank)" className="w-full bg-muted p-4 rounded-xl text-sm font-bold outline-none" value={upiDetails.upiId} onChange={e => setUpiDetails({...upiDetails, upiId: e.target.value})} />
                                            </>
                                        )}
                                    </div>
                                    <button onClick={() => setIsAddingNew(false)} className="text-[10px] font-bold text-primary underline">Back to saved accounts</button>
                                </div>
                            )}

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</label>
                                    <span className="text-[10px] font-bold text-primary">Available: ₹{balance}</span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-muted border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl p-4 pl-8 font-black text-xl transition-all outline-none" placeholder="0" />
                                </div>
                                {amount && !isValidAmount && (
                                    <div className="flex items-center gap-2 text-destructive text-[10px] font-bold ml-1">
                                        <AlertCircle size={12} /> {numAmount < 100 ? "Minimum ₹100 required" : "Insufficient funds"}
                                    </div>
                                )}
                            </div>

                            <button onClick={handleProceedToReview} disabled={!canProceedToReview} className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-20">
                                Review Withdrawal
                            </button>
                        </div>
                    )}

                    {/* STEP 2: REVIEW */}
                    {step === 'review' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">You Receive</p>
                                <h3 className="text-4xl font-black text-primary tracking-tighter">₹{numAmount}</h3>
                            </div>

                            <div className="space-y-4 px-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground font-bold uppercase tracking-tighter">Destination</span>
                                    <span className="text-foreground font-black">{getSelectedDetails()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground font-bold uppercase tracking-tighter">Transfer Fee</span>
                                    <span className="text-emerald-500 font-black">₹0 (Free)</span>
                                </div>
                            </div>

                            <div className="p-4 bg-orange-500/10 rounded-2xl flex gap-3 border border-orange-500/20">
                                <AlertCircle className="text-orange-500 shrink-0" size={18} />
                                <p className="text-[10px] leading-tight font-bold text-orange-600">
                                    Double-check details. Once initiated, transfers to external accounts cannot be reversed or cancelled.
                                </p>
                            </div>

                            <button 
                                onClick={handleFinalSubmit} 
                                disabled={isSubmitting} 
                                className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Confirm & Withdraw"}
                            </button>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === 'success' && (
                        <div className="py-10 text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={48} className="animate-in zoom-in-50 duration-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-foreground">Withdrawal Initiated</h3>
                                <p className="text-muted-foreground text-sm font-medium max-w-[200px] mx-auto mt-2">
                                    Your funds are being processed and should reach your account soon.
                                </p>
                            </div>
                            <button onClick={onClose} className="w-full bg-muted hover:bg-muted/80 text-foreground h-14 rounded-2xl font-black transition-all">
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};