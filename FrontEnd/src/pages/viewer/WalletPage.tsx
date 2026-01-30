import React, { useState } from "react";
import { 
    Wallet, 
    ArrowUpRight, 
    ArrowDownLeft, 
    History, 
    CreditCard, 
    Download, 
    Filter,
    Building2,
    CheckCircle2,
    Clock,
    TrendingUp,
    MoreHorizontal,
    Calendar
} from "lucide-react";
import ManagerLayout from "../layout/ManagerLayout";

// --- MOCK DATA ---
const MOCK_WALLET = {
    balance: 2450.75,
    currency: "$",
    bankName: "Chase Bank",
    accountLast4: "4242",
    nextPayout: "Oct 31, 2023",
    monthlyLimit: 10000,
    withdrawnThisMonth: 1700,
    totalEarned: 45200.50,
    pendingClearance: 320.00
};

const MOCK_HISTORY = [
    { id: 1, type: 'withdrawal', title: 'Withdrawal to Chase Bank', date: 'Oct 24, 2023', time: '2:30 PM', amount: -500.00, status: 'pending', ref: 'WD-9928' },
    { id: 2, type: 'deposit', title: 'Project Milestone: Alpha', date: 'Oct 22, 2023', time: '10:00 AM', amount: 1200.00, status: 'completed', ref: 'DP-8821' },
    { id: 3, type: 'deposit', title: 'Consultation Fee', date: 'Oct 20, 2023', time: '4:15 PM', amount: 150.00, status: 'completed', ref: 'DP-8822' },
    { id: 4, type: 'withdrawal', title: 'Monthly Payout', date: 'Oct 15, 2023', time: '9:00 AM', amount: -1200.50, status: 'completed', ref: 'WD-9927' },
    { id: 5, type: 'deposit', title: 'Refund processed', date: 'Oct 10, 2023', time: '1:20 PM', amount: 45.00, status: 'completed', ref: 'DP-8823' },
    { id: 6, type: 'deposit', title: 'Project Milestone: Beta', date: 'Oct 05, 2023', time: '11:00 AM', amount: 850.00, status: 'completed', ref: 'DP-8824' },
    { id: 7, type: 'deposit', title: 'Retainer Fee', date: 'Oct 01, 2023', time: '09:00 AM', amount: 2000.00, status: 'completed', ref: 'DP-8825' },
];

const WalletPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    
    // Progress calculation
    const limitPercentage = (MOCK_WALLET.withdrawnThisMonth / MOCK_WALLET.monthlyLimit) * 100;

    const handleWithdraw = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <ManagerLayout>
            <div className="max-w-7xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* --- TOP ROW: 3 CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1: Main Balance (Dark Theme) */}
                    <div className="col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-lg border border-slate-700 relative overflow-hidden flex flex-col justify-between h-full min-h-[200px]">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Wallet size={100} />
                        </div>
                        
                        <div className="relative z-10">
                            <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                                Available Balance
                            </p>
                            <h1 className="text-4xl font-bold tracking-tight">
                                {MOCK_WALLET.currency}{MOCK_WALLET.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h1>
                            <p className="text-xs text-slate-400 mt-2">
                                +{MOCK_WALLET.currency}{MOCK_WALLET.pendingClearance.toLocaleString()} pending clearance
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleWithdraw}
                                disabled={loading}
                                className="bg-white text-slate-900 hover:bg-slate-100 py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors w-full shadow-md"
                            >
                                {loading ? <div className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <ArrowUpRight size={16} />}
                                Withdraw
                            </button>
                            <button className="bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors w-full border border-slate-600">
                                <ArrowDownLeft size={16} />
                                Top Up
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Payout Method */}
                    <div className="col-span-1 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col justify-between h-full min-h-[200px]">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Building2 size={18} className="text-primary" />
                                    Payout Method
                                </h3>
                                <button className="p-1 hover:bg-muted rounded-md transition-colors">
                                    <MoreHorizontal size={16} className="text-muted-foreground" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className="h-10 w-10 bg-background border border-border rounded-full flex items-center justify-center shrink-0">
                                    <CreditCard size={20} className="text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{MOCK_WALLET.bankName}</p>
                                    <p className="text-xs text-muted-foreground">**** {MOCK_WALLET.accountLast4}</p>
                                </div>
                                <div className="ml-auto">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar size={14} />
                                    <span>Next Payout:</span>
                                </div>
                                <span className="text-sm font-medium text-foreground">{MOCK_WALLET.nextPayout}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Monthly Limits & Stats */}
                    <div className="col-span-1 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col justify-between h-full min-h-[200px]">
                        <div>
                            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                                <TrendingUp size={18} className="text-primary" />
                                Monthly Activity
                            </h3>
                            
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-muted-foreground">Withdrawal Limit</span>
                                    <span className="font-medium text-foreground">
                                        {Math.round(limitPercentage)}% Used
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${limitPercentage > 80 ? 'bg-orange-500' : 'bg-primary'}`}
                                        style={{ width: `${limitPercentage}%` }} 
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1 text-right">
                                    ${MOCK_WALLET.withdrawnThisMonth.toLocaleString()} of ${MOCK_WALLET.monthlyLimit.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Earned</p>
                                <p className="text-lg font-bold text-foreground">
                                    {MOCK_WALLET.currency}{MOCK_WALLET.totalEarned.toLocaleString()}
                                </p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <ArrowDownLeft size={16} />
                            </div>
                        </div>
                    </div>
                </div>


                {/* --- BOTTOM ROW: FULL WIDTH HISTORY --- */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <History size={20} className="text-primary" />
                                Transaction History
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                View and filter your recent financial activity.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
                                <input 
                                    type="text" 
                                    placeholder="Search ref..." 
                                    className="pl-3 pr-8 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-40"
                                />
                            </div>
                            <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-background border border-border hover:bg-muted rounded-lg transition-colors flex items-center gap-2">
                                <Filter size={14} /> Filter
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-background border border-border hover:bg-muted rounded-lg transition-colors flex items-center gap-2">
                                <Download size={14} /> Export
                            </button>
                        </div>
                    </div>

                    {/* Table Header (Hidden on mobile, visible on desktop for structure) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/40 text-xs font-semibold text-muted-foreground border-b border-border">
                        <div className="col-span-5">TRANSACTION</div>
                        <div className="col-span-2">REF ID</div>
                        <div className="col-span-3">DATE & TIME</div>
                        <div className="col-span-2 text-right">AMOUNT</div>
                    </div>

                    {/* List/Table Body */}
                    <div className="divide-y divide-border">
                        {MOCK_HISTORY.map((item) => (
                            <div key={item.id} className="group hover:bg-muted/30 transition-colors">
                                <div className="p-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    
                                    {/* Col 1: Icon + Title (Span 5) */}
                                    <div className="md:col-span-5 flex items-center gap-4">
                                        <div className={`
                                            h-10 w-10 rounded-full flex items-center justify-center shrink-0 border
                                            ${item.type === 'deposit' 
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                                : 'bg-orange-50 border-orange-100 text-orange-600'}
                                        `}>
                                            {item.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                                            <div className="md:hidden text-xs text-muted-foreground mt-0.5">
                                                {item.date} • {item.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 2: Ref ID (Span 2) - Hidden Mobile */}
                                    <div className="hidden md:block md:col-span-2">
                                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                            #{item.ref}
                                        </span>
                                    </div>

                                    {/* Col 3: Date (Span 3) - Hidden Mobile */}
                                    <div className="hidden md:block md:col-span-3">
                                        <div className="text-sm text-foreground">{item.date}</div>
                                        <div className="text-xs text-muted-foreground">{item.time}</div>
                                    </div>

                                    {/* Col 4: Amount & Status (Span 2) */}
                                    <div className="md:col-span-2 flex flex-col items-end justify-center">
                                        <p className={`text-sm font-bold ${item.type === 'deposit' ? 'text-emerald-600' : 'text-foreground'}`}>
                                            {item.type === 'deposit' ? '+' : ''}{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </p>
                                        
                                        {/* Status Badge (Desktop only, mobile shows in title area) */}
                                        <div className="hidden md:flex mt-1">
                                            {item.status === 'completed' ? (
                                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <CheckCircle2 size={12} className="text-emerald-500" /> Success
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Showing 1-7 of 24 transactions</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors">Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </ManagerLayout>
    );
};

export default WalletPage;