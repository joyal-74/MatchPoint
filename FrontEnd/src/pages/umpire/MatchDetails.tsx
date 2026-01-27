import React, { useState } from 'react';
import {
    ChevronLeft, PlayCircle,
    CalendarDays, MapPin, ListChecks,
    Users, ScrollText, ChevronDown, ChevronUp,
    ShieldCheck, RefreshCcw
} from 'lucide-react';
import Navbar from '../../components/umpire/Navbar';

// --- INTERFACES ---
interface TeamStatus {
    name: string;
    verified: boolean;
    players: number;
}

interface MatchDetailsProps {
    matchId?: string;
}

const MatchDetails: React.FC<MatchDetailsProps> = () => {
    const [showAllRules, setShowAllRules] = useState(false);
    const [teams, setTeams] = useState<{ t1: TeamStatus; t2: TeamStatus }>({
        t1: { name: "Wolves XI", verified: true, players: 11 },
        t2: { name: "Dragons CC", verified: false, players: 0 }
    });

    const rules = [
        "Powerplay: 01 - 06 Overs",
        "DRS: 1 Available per innings",
        "Short Balls: 2 per Over max",
        "No-Ball: Free Hit on all",
        "Fielding: Max 5 outside circle",
        "Timed Out: 3 Minutes limit",
        "Over Rate: 85 mins per innings"
    ];

    const toggleVerify = (teamKey: 't1' | 't2') => {
        setTeams(prev => ({
            ...prev,
            [teamKey]: {
                ...prev[teamKey],
                verified: !prev[teamKey].verified,
                players: !prev[teamKey].verified ? 11 : 0
            }
        }));
    };

    return (
        <>
            <Navbar />
            <div className="bg-background text-foreground selection:bg-primary/20 transition-colors duration-300">
                <main className="mx-auto px-4 lg:px-12 py-2 lg:py-6 space-y-8">

                    {/* --- NAVIGATION & QUICK ACTIONS --- */}
                    <div className="flex items-center justify-between">
                        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            <ChevronLeft size={14} /> Back to Dashboard
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">System Status: <span className="text-green-500">Ready</span></span>
                        </div>
                    </div>

                    {/* --- REDEFINED HERO: MATCH IDENTITY --- */}
                    <div className="relative group p-4 md:p-10 rounded-[2.5rem] bg-card border border-border overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -z-10" />

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="space-y-4 text-center lg:text-left">
                                <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
                                    {teams.t1.name} <span className="text-primary/20 not-italic font-light">VS</span> {teams.t2.name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground font-bold text-xs uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><CalendarDays size={16} className="text-primary" /> Jan 27, 2026</span>
                                    <span className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> Sector 4 Arena</span>
                                </div>
                            </div>

                            <button className="w-full lg:w-auto px-12 py-5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                Start Scoring Console <PlayCircle size={20} fill="currentColor" />
                            </button>
                        </div>
                    </div>

                    {/* --- CONTROL GRID: 3 COLUMNS --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* COL 1: MISSION PARAMETERS */}
                        <div className="bg-card/30 border border-border rounded-[2rem] p-6 space-y-6">
                            <SectionHeader icon={<ListChecks size={18} />} title="Mission Parameters" />
                            <div className="space-y-6">
                                <StatEntry label="Match Format" value="T20 Professional" />
                                <StatEntry label="Toss Window" value="13:45 - 13:55" highlight />
                                <StatEntry label="Official ID" value="#REF-992026" />
                                <StatEntry label="Rain Delay" value="Low Probability" />
                            </div>
                        </div>

                        {/* COL 2: ASSET VERIFICATION (SQUADS) */}
                        <div className="bg-card/30 border border-border rounded-[2rem] p-6 space-y-6">
                            <SectionHeader icon={<Users size={18} />} title="Squad Verification" />
                            <div className="space-y-4">
                                {(['t1', 't2'] as const).map((key) => (
                                    <div key={key} className={`relative p-5 rounded-2xl border transition-all duration-500 ${teams[key].verified ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Team Unit</p>
                                                <h4 className="text-sm font-bold">{teams[key].name}</h4>
                                            </div>
                                            <button
                                                onClick={() => toggleVerify(key)}
                                                className={`p-2 rounded-xl transition-all ${teams[key].verified ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-background text-muted-foreground hover:text-primary'}`}
                                            >
                                                <RefreshCcw size={14} className={teams[key].verified ? '' : 'animate-reverse-spin'} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-1.5 flex-1 rounded-full bg-border overflow-hidden`}>
                                                <div className={`h-full transition-all duration-700 ${teams[key].verified ? 'w-full bg-primary' : 'w-0'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black ${teams[key].verified ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {teams[key].verified ? 'READY' : 'WAITING'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COL 3: FIELD REGULATIONS (WITH EXPANSION) */}
                        <div className="bg-card/30 border border-border rounded-[2rem] p-6 space-y-6 flex flex-col">
                            <SectionHeader icon={<ScrollText size={18} />} title="Field Regulations" />
                            <div className="flex-1 space-y-3">
                                {(showAllRules ? rules : rules.slice(0, 4)).map((rule, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-xl group hover:border-primary/40 transition-colors">
                                        <ShieldCheck size={14} className="text-primary opacity-50 group-hover:opacity-100" />
                                        <span className="text-[11px] font-bold uppercase tracking-tight">{rule}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowAllRules(!showAllRules)}
                                className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
                            >
                                {showAllRules ? (
                                    <>Collapse Rules <ChevronUp size={14} /></>
                                ) : (
                                    <>View All Rules <ChevronDown size={14} /></>
                                )}
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

// --- TS FRIENDLY SUB-COMPONENTS ---

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

const StatEntry: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight = false }) => (
    <div className="group">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{label}</p>
        <p className={`text-sm font-bold tracking-tight ${highlight ? 'text-primary italic animate-pulse' : 'text-foreground'}`}>
            {value}
        </p>
    </div>
);

export default MatchDetails;