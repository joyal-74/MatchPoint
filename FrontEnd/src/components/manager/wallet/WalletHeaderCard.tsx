import { Plus, ArrowUpRight, Lock } from "lucide-react";

interface WalletHeaderCardProps {
    balance: number;
    minLimit: number; // Added to calculate progress text
    onAddMoney: () => void;
    onWithdraw: () => void;
    canWithdraw: boolean;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);

export const WalletHeaderCard = ({ balance, minLimit, onAddMoney, onWithdraw, canWithdraw }: WalletHeaderCardProps) => {
    const diff = minLimit - balance;

    return (
        <div className="bg-slate-950 dark:bg-card border border-white/10 dark:border-border rounded-3xl p-6 text-white dark:text-foreground relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col gap-6">
                {/* Header & Status Label */}
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <p className="text-slate-400 dark:text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-80">
                            Available Balance
                        </p>
                        <h2 className="text-4xl font-extrabold tracking-tight">
                            {formatCurrency(balance)}
                        </h2>
                    </div>

                    {/* Compact Withdrawal Status Pill */}
                    <div className={`shrink-0 px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 ${canWithdraw
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}>
                        {!canWithdraw && <Lock size={10} />}
                        {canWithdraw
                            ? "Eligible"
                            : `Add ${formatCurrency(diff)} to withdraw`}
                    </div>
                </div>

                {/* Vertical Action Stack for Sidebar */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onAddMoney}
                        className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.95] shadow-md shadow-primary/20"
                    >
                        <Plus size={18} /> Add Money
                    </button>
                    <button
                        disabled={!canWithdraw}
                         onClick={onWithdraw}
                        className="w-full bg-white/5 dark:bg-muted/30 backdrop-blur-md text-white dark:text-foreground h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/10 dark:hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed border border-white/5 dark:border-border"
                    >
                        <ArrowUpRight size={18} /> Withdraw
                    </button>
                </div>
            </div>

            {/* Background Aesthetics */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>
        </div>
    );
};