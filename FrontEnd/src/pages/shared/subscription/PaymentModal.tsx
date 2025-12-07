import { X, ArrowRight, Wallet, CreditCard, ShoppingBag, Lock, Shield } from "lucide-react";

type Props = {
    open: boolean;
    planTitle: string;
    amount: number;
    onClose: () => void;
    onSelect: (method: "razorpay" | "stripe" | "paypal") => void;
};

export function PaymentModal({ open, planTitle, amount, onClose, onSelect }: Props) {
    if (!open) return null;

    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount);

    const paymentButtonClasses = "flex items-center justify-between p-4 rounded transition-all duration-200 border cursor-pointer";

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
            <div className="bg-neutral-900 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-neutral-700/50 transform transition-all duration-300 scale-100 opacity-100">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                            <Shield className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                Secure Checkout
                            </h2>
                            <p className="text-neutral-400 text-sm mt-0.5">Complete your subscription upgrade</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full hover:bg-neutral-800 transition-colors"
                        aria-label="Close Payment Modal"
                    >
                        <X className="w-5 h-5 text-neutral-400 hover:text-white" />
                    </button>
                </div>

                {/* Plan Summary */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-5 rounded-2xl mb-6 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-neutral-400">
                            Plan Selected
                        </p>
                        <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-lg text-emerald-400 font-semibold mb-1">{planTitle}</p>
                    <p className="text-3xl font-bold text-white">{formattedAmount}</p>
                </div>
                
                {/* Payment Method Selection */}
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Payment Method</h3>

                <div className="grid grid-cols-1 gap-3">
                    {/* Razorpay Button - Active */}
                    <button
                        onClick={() => onSelect("razorpay")}
                        className={`${paymentButtonClasses} bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border-emerald-500/50 hover:from-emerald-600/30 hover:to-emerald-500/20 hover:border-emerald-400`}
                    >
                        <div className="flex items-center">
                            <div className="bg-emerald-500/20 p-2 rounded-lg mr-3">
                                <Wallet className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-white block">Razorpay</span>
                                <span className="text-xs text-neutral-400">UPI, Cards, Wallets & More</span>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-emerald-400" />
                    </button>

                    <div
                        className={`${paymentButtonClasses} bg-neutral-800/50 border-neutral-700 opacity-50 cursor-not-allowed`}
                    >
                        <div className="flex items-center">
                            <div className="bg-neutral-700/50 p-2 rounded-lg mr-3">
                                <CreditCard className="w-5 h-5 text-neutral-500" />
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-neutral-400 block">Stripe</span>
                                <span className="text-xs text-neutral-500">Coming Soon</span>
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-neutral-500" />
                    </div>

                    <div
                        className={`${paymentButtonClasses} bg-neutral-800/50 border-neutral-700 opacity-50 cursor-not-allowed`}
                    >
                        <div className="flex items-center">
                            <div className="bg-neutral-700/50 p-2 rounded-lg mr-3">
                                <ShoppingBag className="w-5 h-5 text-neutral-500" />
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-neutral-400 block">PayPal</span>
                                <span className="text-xs text-neutral-500">Coming Soon</span>
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-neutral-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}