import { X, ArrowRight, Wallet, CreditCard, ShoppingBag } from "lucide-react";

type Props = {
    open: boolean;
    planTitle: string;
    amount: number;
    onClose: () => void;
    onSelect: (method: "razorpay" | "stripe" | "paypal") => void;
};

export function PaymentModal({ open, planTitle, amount, onClose, onSelect }: Props) {
    if (!open) return null;

    // Helper to format the Indian Rupee amount
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, // Assuming whole rupees for subscription plans
    }).format(amount);

    // Common Tailwind classes for the payment buttons
    const paymentButtonClasses = "flex items-center justify-between p-4 rounded-xl transition-all duration-200 border cursor-pointer";

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
            <div className="bg-neutral-900 p-8 rounded-3xl w-full max-w-sm shadow-2xl border border-neutral-700/50 transform transition-all duration-300 scale-100 opacity-100">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-white">Secure Checkout 🔒</h2>
                        <p className="text-neutral-500 text-sm mt-1">Select your preferred payment gateway.</p>
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
                <div className="bg-neutral-800/50 p-4 rounded-xl mb-6">
                    <p className="text-sm text-neutral-400 mb-1">
                        Upgrading to <span className="text-emerald-400 font-semibold">{planTitle}</span>
                    </p>
                    <p className="text-4xl font-black text-white">{formattedAmount}</p>
                </div>
                
                {/* Payment Method Selection */}
                <h3 className="text-neutral-300 font-semibold mb-3">Payment Gateways</h3>

                <div className="grid grid-cols-1 gap-3">
                    {/* Razorpay Button */}
                    <button
                        onClick={() => onSelect("razorpay")}
                        className={`${paymentButtonClasses} bg-neutral-800 border-emerald-500/30 hover:bg-emerald-600/20`}
                    >
                        <div className="flex items-center">
                            <Wallet className="w-5 h-5 text-emerald-400 mr-3" />
                            <span className="font-semibold text-white">Razorpay (India)</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400" />
                    </button>

                    {/* Stripe Button */}
                    <button
                        onClick={() => onSelect("stripe")}
                        className={`${paymentButtonClasses} bg-neutral-800 border-blue-500/30 hover:bg-blue-600/20`}
                    >
                        <div className="flex items-center">
                            <CreditCard className="w-5 h-5 text-blue-400 mr-3" />
                            <span className="font-semibold text-white">Stripe (Global Card)</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400" />
                    </button>

                    {/* PayPal Button */}
                    <button
                        onClick={() => onSelect("paypal")}
                        className={`${paymentButtonClasses} bg-neutral-800 border-yellow-500/30 hover:bg-yellow-600/20`}
                    >
                        <div className="flex items-center">
                            <ShoppingBag className="w-5 h-5 text-yellow-400 mr-3" />
                            <span className="font-semibold text-white">PayPal</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}