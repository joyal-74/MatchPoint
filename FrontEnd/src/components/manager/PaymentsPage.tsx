import { useState, useEffect } from "react";
import { type TournamentFinancials } from "../../features/manager/financials/financialSlice";
import {
    Search, ArrowUpRight, ArrowDownLeft, RefreshCcw, MoreHorizontal,
    Wallet, TrendingUp, TrendingDown, Calendar, Briefcase, Trophy,
    Users, Crown, PieChart, AlertCircle, CheckCircle2, DollarSign,
    ChevronDown, ChevronUp, ListFilter
} from "lucide-react";
import ManagerLayout from "../../pages/layout/ManagerLayout";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { fetchFinancialReport } from "../../features/manager/financials/financialThunk";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

// --- HELPERS ---
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', signDisplay: 'never' }).format(Math.abs(amount));

const calculateSplits = (t: TournamentFinancials) => {
    const totalCollected = t.currentTeams * t.entryFee;
    const prizePool = totalCollected * 0.70; // 70% to Prize Pool
    const operationalRevenue = totalCollected - prizePool; // 30% Revenue

    let managerSplitPct = 0.5; // Basic Default
    if (t.plan === 'Pro') managerSplitPct = 0.7;
    if (t.plan === 'Elite') managerSplitPct = 0.9;

    return {
        totalCollected,
        prizePool,
        operationalRevenue,
        managerShare: operationalRevenue * managerSplitPct,
        adminShare: operationalRevenue * (1 - managerSplitPct),
        managerSplitPct,
        thresholdMet: t.currentTeams >= t.minTeams
    };
};

export default function FinancialsPage() {
    const dispatch = useAppDispatch();
    const { transactions, tournaments, balance, loading } = useAppSelector((state) => state.financials);
    const managerId = useAppSelector((state) => state.auth.user?._id);

    useEffect(() => {
        if (managerId)
            dispatch(fetchFinancialReport(managerId));
    }, [dispatch, managerId]);

    // View State
    const [activeView, setActiveView] = useState<'transactions' | 'earnings'>('transactions');

    // Transaction States
    const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'refund'>('all');
    const [search, setSearch] = useState("");

    // Earnings State
    const [expandedTournamentId, setExpandedTournamentId] = useState<string | null>(null);

    // --- Transaction Logic ---
    const filteredData = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ? true : t.type === filter;
        if (filter === 'income') return matchesSearch && t.amount > 0;
        if (filter === 'expense') return matchesSearch && t.amount < 0;
        return matchesSearch && matchesFilter;
    });

    // Calculate totals from REAL data
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter(t => t.amount < 0).reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

    return (
        <ManagerLayout>
            <LoadingOverlay show={loading} />
            <div className="min-h-screen bg-background text-foreground py-4 lg:py-8 transition-colors duration-300">
                <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6">

                    {/* --- Unified Header --- */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                    <Wallet className="text-primary" size={24} />
                                </div>
                                Financial Hub
                            </h1>
                            <p className="text-muted-foreground mt-2 ml-1">
                                Manage wallet transactions and tournament revenue splits.
                            </p>
                        </div>

                        {/* --- VIEW TOGGLE TABS --- */}
                        <div className="bg-muted p-1 rounded-xl border border-border flex">
                            <button
                                onClick={() => setActiveView('transactions')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
                                    ${activeView === 'transactions' 
                                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                                        : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <ListFilter size={16} /> Transactions
                            </button>
                            <button
                                onClick={() => setActiveView('earnings')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
                                    ${activeView === 'earnings' 
                                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                                        : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Briefcase size={16} /> Earnings Report
                            </button>
                        </div>
                    </div>

                    {/* ================= VIEW 1: TRANSACTIONS LIST ================= */}
                    {activeView === 'transactions' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 text-primary group-hover:opacity-10 transition-opacity"><Wallet size={80} /></div>
                                    <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
                                    <h3 className="text-3xl font-bold text-foreground mt-2">{formatCurrency(balance)}</h3>
                                </div>
                                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                                            <h3 className="text-3xl font-bold text-foreground mt-2">{formatCurrency(totalIncome)}</h3>
                                        </div>
                                        <div className="p-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg"><TrendingUp size={20} /></div>
                                    </div>
                                </div>
                                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                                            <h3 className="text-3xl font-bold text-foreground mt-2">{formatCurrency(totalExpense)}</h3>
                                        </div>
                                        <div className="p-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg"><TrendingDown size={20} /></div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters & Table */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex p-1 bg-muted rounded-xl border border-border w-full md:w-auto">
                                    {(['all', 'income', 'expense', 'refund'] as const).map((tab) => (
                                        <button 
                                            key={tab} 
                                            onClick={() => setFilter(tab)} 
                                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200
                                            ${filter === tab 
                                                ? 'bg-background text-foreground shadow-sm' 
                                                : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search transactions..." 
                                        value={search} 
                                        onChange={(e) => setSearch(e.target.value)} 
                                        className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input" 
                                    />
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/50">
                                                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Transaction</th>
                                                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Tournament</th>
                                                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                                                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                                                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase text-right">Amount</th>
                                                <th className="p-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredData.length > 0 ? filteredData.map((t) => (
                                                <tr key={t.id} className="hover:bg-muted/50 transition-colors group">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-border 
                                                                ${t.type === 'income' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                                                                  t.type === 'expense' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 
                                                                  'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                                                                {t.type === 'income' && <ArrowUpRight size={18} />}
                                                                {t.type === 'expense' && <ArrowDownLeft size={18} />}
                                                                {t.type === 'refund' && <RefreshCcw size={18} />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-foreground">{t.description}</div>
                                                                <div className="text-xs text-muted-foreground">{t.method}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-foreground/80 flex items-center gap-2">
                                                            <Wallet size={14} className="text-muted-foreground" />{t.tournament}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <Calendar size={14} />{new Date(t.date).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border 
                                                            ${(t.status === 'completed') 
                                                                ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' 
                                                                : t.status === 'pending' 
                                                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' 
                                                                    : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full 
                                                                ${(t.status === 'completed') ? 'bg-green-500' : t.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                            {t.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className={`text-sm font-bold ${t.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                                                            {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4"><button className="p-2 text-muted-foreground hover:text-foreground"><MoreHorizontal size={18} /></button></td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No transactions found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= VIEW 2: EARNINGS BREAKDOWN ================= */}
                    {activeView === 'earnings' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3 text-primary text-sm">
                                <AlertCircle className="shrink-0" size={20} />
                                <div><span className="font-bold">Split Logic:</span> 70% of entry fees go to the Prize Pool. The remaining 30% is revenue shared between you and the platform based on your plan.</div>
                            </div>

                            <div className="space-y-4">
                                {tournaments.map((t) => {
                                    const stats = calculateSplits(t);
                                    const isExpanded = expandedTournamentId === t.id;

                                    return (
                                        <div key={t.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/50 transition-colors">
                                            {/* Summary Row */}
                                            <div onClick={() => setExpandedTournamentId(isExpanded ? null : t.id)} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-muted/30 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl border ${stats.thresholdMet 
                                                        ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                                                        <Trophy size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
                                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-muted text-muted-foreground border border-border">{t.plan} Plan</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1"><Users size={14} /> {t.currentTeams}/{t.minTeams} Teams</span>
                                                            <span className="flex items-center gap-1"><DollarSign size={14} /> {formatCurrency(t.entryFee)} Entry</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-xs text-muted-foreground uppercase font-medium">Your Profit</p>
                                                        <p className={`text-xl font-bold ${stats.thresholdMet ? 'text-foreground' : 'text-muted-foreground'}`}>{formatCurrency(stats.managerShare)}</p>
                                                    </div>
                                                    {isExpanded ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                                                </div>
                                            </div>

                                            {/* Detailed Breakdown */}
                                            {isExpanded && (
                                                <div className="px-6 pb-8 pt-2 border-t border-border bg-muted/20">
                                                    {!stats.thresholdMet && (
                                                        <div className="mb-6 flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm bg-amber-500/10 px-4 py-3 rounded-lg border border-amber-500/20">
                                                            <AlertCircle size={18} /> Minimum teams ({t.minTeams}) not reached. Figures are projected.
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-4">
                                                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Users size={16} className="text-blue-500" /> Collection</h4>
                                                            <div className="p-4 bg-background rounded-xl border border-border space-y-3">
                                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Teams</span><span className="text-foreground">{t.currentTeams}</span></div>
                                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Entry</span><span className="text-foreground">{formatCurrency(t.entryFee)}</span></div>
                                                                <div className="border-t border-border pt-2 flex justify-between text-sm font-medium"><span className="text-foreground/80">Total</span><span className="text-blue-500">{formatCurrency(stats.totalCollected)}</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Crown size={16} className="text-amber-500" /> Prize Pool (70%)</h4>
                                                            <div className="p-4 bg-background rounded-xl border border-border space-y-3 relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full" />
                                                                <p className="text-xs text-muted-foreground">Reserved for winners.</p>
                                                                <div className="border-t border-border pt-2 flex justify-between text-lg font-bold"><span className="text-foreground">Reserved</span><span className="text-amber-600 dark:text-amber-400">{formatCurrency(stats.prizePool)}</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><PieChart size={16} className="text-green-500" /> Net Revenue (30%)</h4>
                                                            <div className="p-4 bg-background rounded-xl border border-border space-y-3">
                                                                <div className="flex justify-between text-sm items-center"><span className="text-muted-foreground">Platform Fee</span><span className="text-red-500">-{formatCurrency(stats.adminShare)}</span></div>
                                                                <div className="flex justify-between text-sm items-center font-medium"><span className="text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 size={12} /> Your Profit</span><span className="text-green-600 dark:text-green-400">+{formatCurrency(stats.managerShare)}</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
        </ManagerLayout>
    );
}