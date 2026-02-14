import { TrendingUp, CheckCircle2 } from "lucide-react";

interface WithdrawalProgressProps {
    balance: number;
    minLimit: number;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        minimumFractionDigits: 0 
    }).format(amount);

export const WithdrawalProgress = ({ balance, minLimit }: WithdrawalProgressProps) => {
    const progress = Math.min((balance / minLimit) * 100, 100);
    const canWithdraw = balance >= minLimit;

    return (
        <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col justify-between min-h-[160px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-primary" />
                    <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
                        Eligibility
                    </h3>
                </div>
                {canWithdraw && <CheckCircle2 size={16} className="text-emerald-500" />}
            </div>

            <div className="space-y-4">
                {/* Percentage and Target */}
                <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">
                        {Math.floor(progress)}%
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold bg-muted px-2 py-0.5 rounded-lg border border-border/50">
                        Target: {formatCurrency(minLimit)}
                    </span>
                </div>

                {/* Progress Bar - Thinner and cleaner */}
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            canWithdraw ? 'bg-emerald-500' : 'bg-primary'
                        }`} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Status Text */}
                <p className="text-[11px] text-muted-foreground leading-snug font-medium">
                    {canWithdraw 
                        ? "Threshold reached. You are eligible for bank transfers."
                        : `Collect ${formatCurrency(minLimit - balance)} more to enable withdrawal.`}
                </p>
            </div>
        </div>
    );
};