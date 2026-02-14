import { ArrowDownLeft, ArrowUpRight, ChevronRight, AlertCircle } from "lucide-react";

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: string;
}

interface TransactionListProps {
    transactions: Transaction[];
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

export const TransactionList = ({ transactions }: TransactionListProps) => {
    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[440px]">
                <div className="divide-y divide-border">
                    {transactions.length > 0 ? transactions.map((t) => (
                        <div key={t.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${t.amount > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                                    {t.amount > 0 ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-foreground">{t.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="w-1 h-1 bg-border rounded-full" />
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${t.status === 'completed' ? 'text-emerald-500' : 'text-orange-400'}`}>
                                            {t.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-lg font-black tracking-tight ${t.amount > 0 ? 'text-emerald-600' : 'text-foreground'}`}>
                                    {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                                </p>
                                <ChevronRight size={16} className="text-muted-foreground ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <AlertCircle className="text-muted-foreground" size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-foreground">No records found</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};