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

    const baseButtonClasses = "flex items-center justify-between p-4 rounded-xl transition-all duration-200 border cursor-pointer group";

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4 animate-in fade-in duration-200">
            <div className="bg-card text-card-foreground p-8 rounded-3xl w-full max-w-md shadow-2xl border border-border transform transition-all duration-300 scale-100 opacity-100 animate-in zoom-in-95">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                Secure Checkout
                            </h2>
                            <p className="text-muted-foreground text-sm mt-0.5">Complete your subscription upgrade</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close Payment Modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Plan Summary - Highlighting using Primary Theme */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-5 rounded-2xl mb-6 border border-primary/20 relative overflow-hidden">
                    {/* Decorative blurred blob */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <p className="text-sm text-muted-foreground font-medium">
                            Plan Selected
                        </p>
                        <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-lg text-primary font-semibold mb-1 relative z-10">{planTitle}</p>
                    <p className="text-3xl font-bold text-foreground relative z-10">{formattedAmount}</p>
                </div>
                
                {/* Payment Method Selection */}
                <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                    Payment Method
                    <span className="h-px flex-1 bg-border"></span>
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {/* Razorpay Button - Active / Primary */}
                    <button
                        onClick={() => onSelect("razorpay")}
                        className={`
                            ${baseButtonClasses} 
                            bg-card hover:bg-accent/50
                            border-primary/50 hover:border-primary
                            shadow-sm hover:shadow-md hover:shadow-primary/10
                        `}
                    >
                        <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-lg mr-3 border border-primary/10 group-hover:border-primary/30 transition-colors">
                                <Wallet className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-foreground block group-hover:text-primary transition-colors">Razorpay</span>
                                <span className="text-xs text-muted-foreground">UPI, Cards, Wallets & More</span>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Stripe Button - Inactive */}
                    <div className={`${baseButtonClasses} bg-muted/40 border-border opacity-60 cursor-not-allowed`}>
                        <div className="flex items-center">
                            <div className="bg-muted p-2 rounded-lg mr-3">
                                <CreditCard className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-muted-foreground block">Stripe</span>
                                <span className="text-xs text-muted-foreground/70">Coming Soon</span>
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* PayPal Button - Inactive */}
                    <div className={`${baseButtonClasses} bg-muted/40 border-border opacity-60 cursor-not-allowed`}>
                        <div className="flex items-center">
                            <div className="bg-muted p-2 rounded-lg mr-3">
                                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="text-left">
                                <span className="font-semibold text-muted-foreground block">PayPal</span>
                                <span className="text-xs text-muted-foreground/70">Coming Soon</span>
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Secure Footer Note */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/80">
                    <Lock size={12} />
                    <span>Payments are encrypted and secured.</span>
                </div>
            </div>
        </div>
    );
}