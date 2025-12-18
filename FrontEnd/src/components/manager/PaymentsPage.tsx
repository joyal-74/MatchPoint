import { useState } from "react";
import {
    Search,

    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    MoreHorizontal,
    Wallet,
    TrendingUp,
    TrendingDown,
    Calendar,

    Briefcase,
    Trophy,
    Users,
    Crown,
    PieChart,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    ChevronDown,
    ChevronUp,
    ListFilter
} from "lucide-react";
import ManagerLayout from "../../pages/layout/ManagerLayout";

// --- MOCK DATA: TRANSACTIONS ---
type TransactionType = 'income' | 'expense' | 'refund';
type TransactionStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
    id: string;
    date: string; 
    description: string;
    tournament: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    method: string;
}

const TRANSACTIONS: Transaction[] = [
    { id: "TX-1001", date: "2024-03-10", description: "Entry Fee - Team Velocity", tournament: "Summer Cyber Cup", type: "income", amount: 50.00, status: "completed", method: "Stripe" },
    { id: "TX-1002", date: "2024-03-09", description: "Registration Fee", tournament: "Global Pro League", type: "expense", amount: -120.00, status: "completed", method: "PayPal" },
    { id: "TX-1003", date: "2024-03-08", description: "Entry Fee - Dark Horse", tournament: "Summer Cyber Cup", type: "income", amount: 50.00, status: "completed", method: "Stripe" },
    { id: "TX-1004", date: "2024-03-05", description: "Cancellation Refund", tournament: "Weekly Scrims #42", type: "refund", amount: 25.00, status: "completed", method: "Credit Card" },
    { id: "TX-1005", date: "2024-03-04", description: "Entry Fee - NoobMasters", tournament: "Summer Cyber Cup", type: "income", amount: 50.00, status: "pending", method: "Bank Transfer" },
];

// --- MOCK DATA: TOURNAMENT EARNINGS ---
interface TournamentFinancials {
    id: string;
    name: string;
    plan: 'Basic' | 'Pro' | 'Elite';
    entryFee: number;
    minTeams: number;
    currentTeams: number;
    status: 'Upcoming' | 'Live' | 'Completed';
}

const TOURNAMENTS: TournamentFinancials[] = [
    { id: "T-101", name: "Summer Cyber Cup", plan: "Basic", entryFee: 100, minTeams: 10, currentTeams: 12, status: "Live" },
    { id: "T-102", name: "Winter Skirmish", plan: "Basic", entryFee: 50, minTeams: 20, currentTeams: 8, status: "Upcoming" },
    { id: "T-103", name: "Pro League Qualifier", plan: "Pro", entryFee: 200, minTeams: 8, currentTeams: 16, status: "Completed" }
];

// --- HELPERS ---
const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', signDisplay: 'never' }).format(Math.abs(amount));

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
    // View State: This toggles between the two screens
    const [activeView, setActiveView] = useState<'transactions' | 'earnings'>('transactions');
    
    // Transaction States
    const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'refund'>('all');
    const [search, setSearch] = useState("");
    
    // Earnings State
    const [expandedTournamentId, setExpandedTournamentId] = useState<string | null>(TOURNAMENTS[0].id);

    // --- Transaction Logic ---
    const filteredData = TRANSACTIONS.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ? true : t.type === filter;
        if (filter === 'income') return matchesSearch && t.amount > 0;
        if (filter === 'expense') return matchesSearch && t.amount < 0;
        return matchesSearch && matchesFilter;
    });

    const totalIncome = TRANSACTIONS.filter(t => t.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = TRANSACTIONS.filter(t => t.amount < 0).reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    const balance = totalIncome - totalExpense;

    return (
        <ManagerLayout>
            <div className="min-h-screen text-neutral-200 py-4 lg:py-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* --- Unified Header --- */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-neutral-800 rounded-lg border border-white/5">
                                    <Wallet className="text-emerald-500" size={24} />
                                </div>
                                Financial Hub
                            </h1>
                            <p className="text-neutral-500 mt-2 ml-1">
                                Manage wallet transactions and tournament revenue splits.
                            </p>
                        </div>

                        {/* --- VIEW TOGGLE TABS --- */}
                        <div className="bg-neutral-900 p-1 rounded-xl border border-white/10 flex">
                            <button 
                                onClick={() => setActiveView('transactions')}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all
                                    ${activeView === 'transactions' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}
                                `}
                            >
                                <ListFilter size={16} />
                                Transactions
                            </button>
                            <button 
                                onClick={() => setActiveView('earnings')}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all
                                    ${activeView === 'earnings' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}
                                `}
                            >
                                <Briefcase size={16} />
                                Earnings Report
                            </button>
                        </div>
                    </div>

                    {/* =====================================================================================
                        VIEW 1: TRANSACTIONS LIST (Your existing UI)
                       ===================================================================================== */}
                    {activeView === 'transactions' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet size={80} /></div>
                                    <p className="text-sm font-medium text-neutral-400">Net Balance</p>
                                    <h3 className="text-3xl font-bold text-white mt-2">{formatCurrency(balance)}</h3>
                                </div>
                                <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start">
                                        <div><p className="text-sm font-medium text-neutral-400">Total Income</p><h3 className="text-3xl font-bold text-white mt-2">{formatCurrency(totalIncome)}</h3></div>
                                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><TrendingUp size={20} /></div>
                                    </div>
                                </div>
                                <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start">
                                        <div><p className="text-sm font-medium text-neutral-400">Total Expenses</p><h3 className="text-3xl font-bold text-white mt-2">{formatCurrency(totalExpense)}</h3></div>
                                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><TrendingDown size={20} /></div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters & Table */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex p-1 bg-neutral-900 rounded-xl border border-white/5 w-full md:w-auto">
                                    {(['all', 'income', 'expense', 'refund'] as const).map((tab) => (
                                        <button key={tab} onClick={() => setFilter(tab)} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === tab ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>{tab}</button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                                    <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-neutral-800/50">
                                                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase">Transaction</th>
                                                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase">Tournament</th>
                                                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase">Date</th>
                                                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase">Status</th>
                                                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase text-right">Amount</th>
                                                <th className="p-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredData.map((t) => (
                                                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : t.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                                {t.type === 'income' && <ArrowUpRight size={18} />}
                                                                {t.type === 'expense' && <ArrowDownLeft size={18} />}
                                                                {t.type === 'refund' && <RefreshCcw size={18} />}
                                                            </div>
                                                            <div><div className="text-sm font-medium text-white">{t.description}</div><div className="text-xs text-neutral-500">{t.method}</div></div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4"><div className="text-sm text-neutral-300 flex items-center gap-2"><Wallet size={14} className="text-neutral-600" />{t.tournament}</div></td>
                                                    <td className="p-4"><div className="text-sm text-neutral-400 flex items-center gap-2"><Calendar size={14} className="text-neutral-600" />{new Date(t.date).toLocaleDateString()}</div></td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : t.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'completed' ? 'bg-emerald-400' : t.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'}`} />
                                                            {t.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right"><div className={`text-sm font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>{t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}</div></td>
                                                    <td className="p-4"><button className="p-2 text-neutral-500 hover:text-white"><MoreHorizontal size={18} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =====================================================================================
                        VIEW 2: EARNINGS BREAKDOWN (New Logic)
                       ===================================================================================== */}
                    {activeView === 'earnings' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-blue-300 text-sm">
                                <AlertCircle className="shrink-0" size={20} />
                                <div><span className="font-bold">Split Logic:</span> 70% of entry fees go to the Prize Pool. The remaining 30% is revenue shared between you and the platform based on your plan.</div>
                            </div>

                            <div className="space-y-4">
                                {TOURNAMENTS.map((t) => {
                                    const stats = calculateSplits(t);
                                    const isExpanded = expandedTournamentId === t.id;

                                    return (
                                        <div key={t.id} className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                                            {/* Summary Row */}
                                            <div onClick={() => setExpandedTournamentId(isExpanded ? null : t.id)} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-white/[0.02] transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl border ${stats.thresholdMet ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                                                        <Trophy size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-bold text-white">{t.name}</h3>
                                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-neutral-800 text-neutral-400 border border-white/10">{t.plan} Plan</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                                                            <span className="flex items-center gap-1"><Users size={14} /> {t.currentTeams}/{t.minTeams} Teams</span>
                                                            <span className="flex items-center gap-1"><DollarSign size={14} /> {t.entryFee} Entry</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-xs text-neutral-500 uppercase font-medium">Your Profit</p>
                                                        <p className={`text-xl font-bold ${stats.thresholdMet ? 'text-white' : 'text-neutral-500'}`}>{formatCurrency(stats.managerShare)}</p>
                                                    </div>
                                                    {isExpanded ? <ChevronUp className="text-neutral-500" /> : <ChevronDown className="text-neutral-500" />}
                                                </div>
                                            </div>

                                            {/* Detailed Breakdown */}
                                            {isExpanded && (
                                                <div className="px-6 pb-8 pt-2 border-t border-white/5 bg-neutral-800/20">
                                                    {!stats.thresholdMet && (
                                                        <div className="mb-6 flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 px-4 py-3 rounded-lg border border-amber-500/20">
                                                            <AlertCircle size={18} /> Minimum teams ({t.minTeams}) not reached. Figures are projected.
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {/* Col 1 */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-sm font-semibold text-white flex items-center gap-2"><Users size={16} className="text-blue-500" /> Collection</h4>
                                                            <div className="p-4 bg-neutral-900 rounded-xl border border-white/5 space-y-3">
                                                                <div className="flex justify-between text-sm"><span className="text-neutral-400">Teams</span><span className="text-white">{t.currentTeams}</span></div>
                                                                <div className="flex justify-between text-sm"><span className="text-neutral-400">Entry</span><span className="text-white">{formatCurrency(t.entryFee)}</span></div>
                                                                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-medium"><span className="text-neutral-300">Total</span><span className="text-blue-400">{formatCurrency(stats.totalCollected)}</span></div>
                                                            </div>
                                                        </div>
                                                        {/* Col 2 */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-sm font-semibold text-white flex items-center gap-2"><Crown size={16} className="text-amber-500" /> Prize Pool (70%)</h4>
                                                            <div className="p-4 bg-neutral-900 rounded-xl border border-white/5 space-y-3 relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full" />
                                                                <p className="text-xs text-neutral-500">Reserved for winners.</p>
                                                                <div className="border-t border-white/10 pt-2 flex justify-between text-lg font-bold"><span className="text-white">Reserved</span><span className="text-amber-400">{formatCurrency(stats.prizePool)}</span></div>
                                                            </div>
                                                        </div>
                                                        {/* Col 3 */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-sm font-semibold text-white flex items-center gap-2"><PieChart size={16} className="text-emerald-500" /> Net Revenue (30%)</h4>
                                                            <div className="p-4 bg-neutral-900 rounded-xl border border-white/5 space-y-3">
                                                                <div className="flex justify-between text-sm items-center"><span className="text-neutral-400">Platform Fee</span><span className="text-red-400">-{formatCurrency(stats.adminShare)}</span></div>
                                                                <div className="flex justify-between text-sm items-center font-medium"><span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Your Profit</span><span className="text-emerald-400">+{formatCurrency(stats.managerShare)}</span></div>
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