import { useState } from "react";
import { X, Smartphone, CreditCard } from "lucide-react";

interface DepositModalProps {
    onClose: () => void;
    onProceed: (amount: string, method: string) => void;
}

export const DepositModal = ({ onClose, onProceed }: DepositModalProps) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'upi' | 'razorpay' | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount && Number(amount) > 0 && method) {
            onProceed(amount, method);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <style>
                {`
                    /* Hide Chrome/Safari/Edge/Opera number spinners */
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    /* Hide Firefox number spinners */
                    input[type=number] {
                        -moz-appearance: textfield;
                    }
                `}
            </style>
            
            <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                    <h3 className="text-lg font-bold text-foreground">Add Money to Wallet</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Enter Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₹</span>
                            <input 
                                type="number" 
                                min="0"
                                step="any"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (Number(val) >= 0 || val === "") {
                                        setAmount(val);
                                    }
                                }}
                                className="w-full bg-muted/50 border border-transparent rounded-2xl pl-10 pr-4 py-4 text-3xl font-black text-foreground focus:ring-2 focus:ring-primary focus:bg-background transition-all outline-none"
                                placeholder="0"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Select Payment Method</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                type="button"
                                onClick={() => setMethod('upi')}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                    method === 'upi' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground bg-background'
                                }`}
                            >
                                <Smartphone size={28} />
                                <span className="text-xs font-bold uppercase tracking-tight">UPI / PhonePe</span>
                            </button>
                            
                            <button 
                                type="button"
                                onClick={() => setMethod('razorpay')}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                    method === 'razorpay' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground bg-background'
                                }`}
                            >
                                <CreditCard size={28} />
                                <span className="text-xs font-bold uppercase tracking-tight">Razorpay</span>
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={!amount || Number(amount) <= 0 || !method} 
                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 hover:opacity-90 transition-all active:scale-[0.98]"
                    >
                        Proceed to Pay
                    </button>
                </form>
            </div>
        </div>
    );
};