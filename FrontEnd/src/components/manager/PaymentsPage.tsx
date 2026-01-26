import { useState, useEffect } from "react";
import {
    Search, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, TrendingDown, 
    Briefcase, ListFilter, X, Loader2, Building2, 
    CheckCircle2, ShieldCheck,
    Landmark, ChevronDown, ChevronUp
} from "lucide-react";
import ManagerLayout from "../../pages/layout/ManagerLayout";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { fetchFinancialReport } from "../../features/manager/financials/financialThunk";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

// --- HELPERS ---
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(Math.abs(amount));

// --- COMPONENT: WITHDRAWAL MODAL ---
const WithdrawalModal = ({ 
    balance, 
    bankDetails, 
    onClose 
}: { 
    balance: number, 
    bankDetails: any, 
    onClose: () => void 
}) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleWithdraw = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); setStep(2); }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <ArrowUpRight size={18} className="text-primary" /> Withdraw Funds
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-muted-foreground hover:text-foreground" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* Destination Card */}
                            <div className="bg-muted/30 border border-border rounded-xl p-4 flex items-center gap-4">
                                <div className="h-10 w-10 bg-background border border-border rounded-full flex items-center justify-center shrink-0 text-primary">
                                    <Landmark size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Transferring To</p>
                                    <p className="text-sm font-bold text-foreground">{bankDetails.bankName}</p>
                                    <p className="text-xs text-muted-foreground">**** {bankDetails.last4}</p>
                                </div>
                                <div className="ml-auto">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                </div>
                            </div>

                            {/* Input */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-muted-foreground">Amount to Withdraw</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-xl font-semibold text-muted-foreground">₹</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-background border border-input rounded-xl pl-8 pr-4 py-3 text-xl font-bold text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="0"
                                    />
                                    <button 
                                        onClick={() => setAmount(balance.toString())}
                                        className="absolute right-3 top-3.5 text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <p className="text-xs text-right text-muted-foreground">Available Balance: {formatCurrency(balance)}</p>
                            </div>

                            <button 
                                onClick={handleWithdraw}
                                disabled={!amount || Number(amount) <= 0 || Number(amount) > balance || loading}
                                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : "Confirm Transfer"}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Withdrawal Initiated</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">
                                    <span className="font-medium text-foreground">₹{amount}</span> is on its way to your account ending in {bankDetails.last4}.
                                </p>
                            </div>
                            <button onClick={onClose} className="w-full py-2.5 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 mt-4">Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function FinancialsPage() {
    const dispatch = useAppDispatch();
    const { transactions, tournaments, balance, loading } = useAppSelector((state) => state.financials);
    const managerId = useAppSelector((state) => state.auth.user?._id);

    // Mock Bank Details (In real app, fetch from API)
    const bankDetails = {
        bankName: "HDFC Bank",
        last4: "4291",
        status: "Verified",
        holder: "John Doe"
    };

    useEffect(() => {
        if (managerId) dispatch(fetchFinancialReport(managerId));
    }, [dispatch, managerId]);

    const [activeView, setActiveView] = useState<'transactions' | 'earnings'>('transactions');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [search, setSearch] = useState("");
    const [expandedTournamentId, setExpandedTournamentId] = useState<string | null>(null);

    // Calculate Totals
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.amount < 0).reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    
    // Filter Transactions
    const filteredData = transactions.filter(t => 
        t.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ManagerLayout>
            <LoadingOverlay show={loading} />
            {showWithdrawModal && <WithdrawalModal balance={balance} bankDetails={bankDetails} onClose={() => setShowWithdrawModal(false)} />}
            
            <div className="min-h-screen bg-background text-foreground py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

                    {/* Page Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Financial Hub</h1>
                            <p className="text-xs text-muted-foreground">Wallet, payouts, and earnings reports.</p>
                        </div>
                    </div>

                    {/* === MASTER LAYOUT GRID === */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* --- LEFT COLUMN: WALLET & LIQUIDITY (1/3 width) --- */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* 1. Main Balance Card */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={120} /></div>
                                
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Available Balance</p>
                                    <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
                                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                        <TrendingUp size={12} /> +2.4% this month
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 relative z-10 mt-6">
                                    <button 
                                        onClick={() => setShowWithdrawModal(true)}
                                        className="bg-white text-slate-900 hover:bg-slate-100 py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                                    >
                                        <ArrowUpRight size={16} /> Withdraw
                                    </button>
                                    <button className="bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm border border-slate-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all">
                                        <ArrowDownLeft size={16} /> Top Up
                                    </button>
                                </div>
                            </div>

                            {/* 2. Linked Account Details (THE REQUESTED FEATURE) */}
                            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                        <Building2 size={16} className="text-muted-foreground" />
                                        Payout Method
                                    </h3>
                                    <button className="text-xs text-primary font-medium hover:underline">Manage</button>
                                </div>

                                <div className="p-4 bg-muted/40 border border-border/50 rounded-xl relative group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white border border-border rounded-full flex items-center justify-center shrink-0">
                                            <Landmark size={20} className="text-slate-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{bankDetails.bankName}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <span>•••• {bankDetails.last4}</span>
                                                <span className="text-border">•</span>
                                                <span>{bankDetails.holder}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-medium">
                                            <ShieldCheck size={10} /> Verified
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">Primary Account</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                                    Automatic payouts are scheduled for every Friday.
                                </p>
                            </div>

                        </div>

                        {/* --- RIGHT COLUMN: STATS & DATA (2/3 width) --- */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            
                            {/* 1. Quick Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Total Earned</p>
                                        <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalIncome)}</h3>
                                    </div>
                                    <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                                        <TrendingUp size={20} />
                                    </div>
                                </div>
                                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Platform Fees</p>
                                        <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalExpense)}</h3>
                                    </div>
                                    <div className="h-10 w-10 bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center">
                                        <TrendingDown size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Main Data Section (Tabs + Content) */}
                            <div className="bg-card border border-border rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden min-h-[500px]">
                                
                                {/* Header / Tabs */}
                                <div className="px-6 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex p-1 bg-background rounded-lg border border-border w-fit shadow-sm">
                                        <button 
                                            onClick={() => setActiveView('transactions')}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeView === 'transactions' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <ListFilter size={14} /> Transactions
                                        </button>
                                        <button 
                                            onClick={() => setActiveView('earnings')}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeView === 'earnings' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <Briefcase size={14} /> Earnings Report
                                        </button>
                                    </div>
                                    
                                    {activeView === 'transactions' && (
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={14} />
                                            <input 
                                                type="text" 
                                                placeholder="Search history..." 
                                                value={search} 
                                                onChange={(e) => setSearch(e.target.value)} 
                                                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Content Body */}
                                <div className="p-0 flex-1 overflow-x-auto">
                                    {activeView === 'transactions' ? (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-border bg-muted/10 text-xs text-muted-foreground uppercase tracking-wider">
                                                    <th className="p-4 font-semibold">Details</th>
                                                    <th className="p-4 font-semibold hidden sm:table-cell">Date</th>
                                                    <th className="p-4 font-semibold hidden sm:table-cell">Status</th>
                                                    <th className="p-4 font-semibold text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {filteredData.length > 0 ? filteredData.map((t) => (
                                                    <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${t.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'}`}>
                                                                    {t.type === 'income' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-foreground">{t.description}</div>
                                                                    <div className="text-xs text-muted-foreground sm:hidden">{new Date(t.date).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{new Date(t.date).toLocaleDateString()}</td>
                                                        <td className="p-4 hidden sm:table-cell">
                                                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border capitalize">
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td className={`p-4 text-right text-sm font-bold ${t.amount > 0 ? 'text-emerald-600' : 'text-foreground'}`}>
                                                            {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">No transactions found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-6 space-y-4">
                                            {/* Earnings Logic (Same as before but simplified UI) */}
                                            {tournaments.map(t => (
                                                <div key={t.id} className="border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedTournamentId(expandedTournamentId === t.id ? null : t.id)}>
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                                                                {t.currentTeams}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                                                                <p className="text-xs text-muted-foreground">{t.plan} Plan • {formatCurrency(t.entryFee)} Entry</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="text-xs text-muted-foreground">Est. Profit</p>
                                                                <p className="text-sm font-bold text-emerald-600">
                                                                    {formatCurrency((t.currentTeams * t.entryFee * 0.3 * (t.plan === 'Elite' ? 0.9 : 0.5)))}
                                                                </p>
                                                            </div>
                                                            {expandedTournamentId === t.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </div>
                                                    </div>
                                                    
                                                    {expandedTournamentId === t.id && (
                                                        <div className="mt-4 pt-4 border-t border-border bg-muted/20 -mx-4 -mb-4 px-4 py-4 rounded-b-xl text-sm">
                                                            <div className="flex justify-between mb-2">
                                                                <span>Total Collection</span>
                                                                <span className="font-medium">{formatCurrency(t.currentTeams * t.entryFee)}</span>
                                                            </div>
                                                            <div className="flex justify-between mb-2 text-muted-foreground">
                                                                <span>Prize Pool (70%)</span>
                                                                <span>{formatCurrency(t.currentTeams * t.entryFee * 0.7)}</span>
                                                            </div>
                                                            <div className="flex justify-between font-bold text-emerald-600">
                                                                <span>Your Share</span>
                                                                <span>{formatCurrency((t.currentTeams * t.entryFee * 0.3 * (t.plan === 'Elite' ? 0.9 : 0.5)))}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}