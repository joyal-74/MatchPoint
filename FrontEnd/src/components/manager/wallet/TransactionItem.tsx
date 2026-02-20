import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);


export const TransactionItem = ({ transaction }: { transaction: any }) => (
    <div className="p-5 flex items-center justify-between hover:bg-muted/30 transition-all group">
        <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${transaction.amount > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                {transaction.amount > 0 ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
            </div>
            <div>
                <p className="text-sm font-black text-foreground">{transaction.description}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                    {new Date(transaction.date).toLocaleDateString('en-IN')} • <span className={transaction.status === 'completed' ? 'text-emerald-500' : 'text-orange-400'}>{transaction.status}</span>
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className={`text-lg font-black ${transaction.amount > 0 ? 'text-emerald-600' : 'text-foreground'}`}>
                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
            </p>
            <ChevronRight size={16} className="text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-all" />
        </div>
    </div>
);