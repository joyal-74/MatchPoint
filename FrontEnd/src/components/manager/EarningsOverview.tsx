import { useState } from "react";
import {
    Trophy,
    Users,
    PieChart,
    AlertCircle,
    CheckCircle2,
    Briefcase,
    Crown,
    Info,
    ChevronDown,
    ChevronUp,
    DollarSign
} from "lucide-react";
import ManagerLayout from "../../pages/layout/ManagerLayout";

// --- Constants & Types ---

type PlanType = 'Basic' | 'Pro' | 'Elite';

interface TournamentFinancials {
    id: string;
    name: string;
    plan: PlanType;
    entryFee: number;
    minTeams: number;
    currentTeams: number;
    status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';
}

const MOCK_TOURNAMENTS: TournamentFinancials[] = [
    {
        id: "T-101",
        name: "Summer Cyber Cup",
        plan: "Basic", // 50/50 Split on Revenue
        entryFee: 100,
        minTeams: 10,
        currentTeams: 12, // Threshold met
        status: "Live"
    },
    {
        id: "T-102",
        name: "Winter Skirmish",
        plan: "Basic",
        entryFee: 50,
        minTeams: 20,
        currentTeams: 8, // Threshold NOT met
        status: "Upcoming"
    },
    {
        id: "T-103",
        name: "Pro League Qualifier",
        plan: "Pro", // Let's say Pro is 70/30 Split
        entryFee: 200,
        minTeams: 8,
        currentTeams: 16,
        status: "Completed"
    }
];

// --- Helper Functions for The Math ---

const calculateSplits = (t: TournamentFinancials) => {
    // 1. Calculate Gross Total
    const totalCollected = t.currentTeams * t.entryFee;
    
    // 2. Calculate Prize Pool (70% of Total)
    const prizePool = totalCollected * 0.70;

    // 3. Calculate Operational Revenue (The remaining 30%)
    const operationalRevenue = totalCollected - prizePool;

    // 4. Calculate Splits based on Plan
    let managerSplitPct = 0.5; // Default Basic: 50%
    
    if (t.plan === 'Pro') managerSplitPct = 0.7; // Example: Pro gets 70%
    if (t.plan === 'Elite') managerSplitPct = 0.9; // Example: Elite gets 90%

    const managerShare = operationalRevenue * managerSplitPct;
    const adminShare = operationalRevenue * (1 - managerSplitPct);

    return {
        totalCollected,
        prizePool,
        operationalRevenue,
        managerShare,
        adminShare,
        managerSplitPct,
        thresholdMet: t.currentTeams >= t.minTeams
    };
};

const formatMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);


export default function EarningsPage() {
    const [expandedId, setExpandedId] = useState<string | null>(MOCK_TOURNAMENTS[0].id);

    const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

    return (
        <ManagerLayout>
            <div className="min-h-screen text-neutral-200 p-4 lg:p-8">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-neutral-800 rounded-lg border border-white/5">
                                <Briefcase className="text-emerald-500" size={24} />
                            </div>
                            Earnings & Settlements
                        </h1>
                        <p className="text-neutral-500 mt-2">
                            Track revenue splits, platform fees, and prize pool allocations based on your subscription.
                        </p>
                    </div>

                    {/* Disclaimer / Info Banner */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-blue-300 text-sm">
                        <Info className="shrink-0" size={20} />
                        <div>
                            <span className="font-bold">How splits work:</span> 70% of collected entry fees go directly to the Prize Pool. 
                            The remaining 30% is split between You and the Platform based on your subscription plan (Basic: 50/50).
                        </div>
                    </div>

                    {/* Tournament List */}
                    <div className="space-y-4">
                        {MOCK_TOURNAMENTS.map((t) => {
                            const stats = calculateSplits(t);
                            const isExpanded = expandedId === t.id;

                            return (
                                <div key={t.id} className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden shadow-lg transition-all">
                                    
                                    {/* Card Summary Header (Always Visible) */}
                                    <div 
                                        onClick={() => toggleExpand(t.id)}
                                        className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`
                                                p-3 rounded-xl border
                                                ${stats.thresholdMet ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}
                                            `}>
                                                <Trophy size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-bold text-white">{t.name}</h3>
                                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-neutral-800 text-neutral-400 border border-white/10">
                                                        {t.plan} Plan
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                                                    <span className="flex items-center gap-1"><Users size={14} /> {t.currentTeams}/{t.minTeams} Teams</span>
                                                    <span className="flex items-center gap-1"><DollarSign size={14} /> {t.entryFee} Entry</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-neutral-500 uppercase font-medium">Your Share</p>
                                                <p className={`text-xl font-bold ${stats.thresholdMet ? 'text-white' : 'text-neutral-500'}`}>
                                                    {formatMoney(stats.managerShare)}
                                                </p>
                                            </div>
                                            {isExpanded ? <ChevronUp className="text-neutral-500" /> : <ChevronDown className="text-neutral-500" />}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-6 pb-8 pt-2 border-t border-white/5 bg-neutral-800/20">
                                            
                                            {/* Status Alert if Min Teams not met */}
                                            {!stats.thresholdMet && (
                                                <div className="mb-6 flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 px-4 py-3 rounded-lg border border-amber-500/20">
                                                    <AlertCircle size={18} />
                                                    Minimum teams ({t.minTeams}) not reached. These figures are projected and not yet settled.
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                
                                                {/* 1. Collection Stats */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                                        <Users size={16} className="text-blue-500" /> Collection
                                                    </h4>
                                                    <div className="p-4 bg-neutral-900 rounded-xl border border-white/5 space-y-3">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-neutral-400">Teams Registered</span>
                                                            <span className="text-white">{t.currentTeams}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-neutral-400">Entry Fee</span>
                                                            <span className="text-white">{formatMoney(t.entryFee)}</span>
                                                        </div>
                                                        <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-medium">
                                                            <span className="text-neutral-300">Total Collected</span>
                                                            <span className="text-blue-400">{formatMoney(stats.totalCollected)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 2. Prize Pool (70%) */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                                        <Crown size={16} className="text-amber-500" /> Prize Pool (70%)
                                                    </h4>
                                                    <div className="p-4 bg-neutral-900 rounded-xl border border-white/5 space-y-3 relative overflow-hidden">
                                                        {/* Visual Bar */}
                                                        <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full" />
                                                        
                                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                                            This amount is automatically reserved for the tournament winners and is not part of revenue.
                                                        </p>
                                                        <div className="border-t border-white/10 pt-2 flex justify-between text-lg font-bold">
                                                            <span className="text-white">Reserved</span>
                                                            <span className="text-amber-400">{formatMoney(stats.prizePool)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 3. Revenue Split (30%) */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                                        <PieChart size={16} className="text-emerald-500" /> Revenue Split
                                                    </h4>
                                                    <div className="p-4 bg-neutral-900 rounded-xl border border-white/5 space-y-3">
                                                        <div className="flex justify-between text-xs text-neutral-500 mb-2">
                                                            <span>Gross Revenue (30% of Total)</span>
                                                            <span>{formatMoney(stats.operationalRevenue)}</span>
                                                        </div>

                                                        {/* Admin Share */}
                                                        <div className="flex justify-between text-sm items-center">
                                                            <span className="text-neutral-400">Platform Fee ({(1 - stats.managerSplitPct) * 100}%)</span>
                                                            <span className="text-red-400">-{formatMoney(stats.adminShare)}</span>
                                                        </div>

                                                        {/* Manager Share */}
                                                        <div className="flex justify-between text-sm items-center font-medium">
                                                            <span className="text-emerald-400 flex items-center gap-1">
                                                                <CheckCircle2 size={12} /> Your Net Profit ({stats.managerSplitPct * 100}%)
                                                            </span>
                                                            <span className="text-emerald-400">+{formatMoney(stats.managerShare)}</span>
                                                        </div>
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
            </div>
        </ManagerLayout>
    );
}