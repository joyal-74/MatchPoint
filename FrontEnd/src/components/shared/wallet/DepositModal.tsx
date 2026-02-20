import { useState } from "react";
import { X, ShieldCheck, CheckCircle2 } from "lucide-react";

interface DepositModalProps {
    onClose: () => void;
    onProceed: (amount: string, method: string) => void;
}

export type PaymentMethods = 'razorpay' | 'stripe';

export const DepositModal = ({ onClose, onProceed }: DepositModalProps) => {
    const [amount, setAmount] = useState('');
    const [selectedGateway, setSelectedGateway] = useState<'razorpay' | 'stripe'>('razorpay');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount && Number(amount) >= 10) {
            onProceed(amount, selectedGateway);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-border flex justify-between items-center bg-muted/10">
                    <div>
                        <h3 className="text-xl font-black text-foreground tracking-tight">Add Funds</h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Select amount and provider</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Amount Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount (INR)</label>
                        </div>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">₹</span>
                            <input 
                                type="number" 
                                value={amount}
                                min={0}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-muted/50 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl pl-12 pr-6 py-5 text-3xl font-black text-foreground transition-all outline-none"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Gateway Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Provider</label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'razorpay', label: 'Razorpay', sub: 'UPI, Cards, Net' },
                                { id: 'stripe', label: 'Stripe', sub: 'Cards, Apple Pay' }
                            ].map((gateway) => (
                                <button
                                    key={gateway.id}
                                    type="button"
                                    onClick={() => setSelectedGateway(gateway.id as PaymentMethods)}
                                    className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                                        selectedGateway === gateway.id 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-border bg-background hover:bg-muted/50'
                                    }`}
                                >
                                    <p className={`text-sm font-black ${selectedGateway === gateway.id ? 'text-primary' : 'text-foreground'}`}>
                                        {gateway.label}
                                    </p>
                                    <p className="text-[9px] font-bold text-muted-foreground mt-1">{gateway.sub}</p>
                                    {selectedGateway === gateway.id && (
                                        <CheckCircle2 size={16} className="absolute top-3 right-3 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Trust Indicator */}
                    <div className="flex items-center justify-center gap-2 py-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                            Secure Encrypted Payment via {selectedGateway === 'razorpay' ? 'Razorpay' : 'Stripe'}
                        </p>
                    </div>

                    <button 
                        type="submit"
                        disabled={!amount || Number(amount) < 10} 
                        className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 disabled:opacity-30 hover:opacity-90 transition-all active:scale-[0.98]"
                    >
                        Proceed to Pay
                    </button>
                </form>
            </div>
        </div>
    );
};