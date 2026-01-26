import { useState } from 'react';
import { 
    Calendar, MapPin, ChevronLeft, Share2, 
    Trophy, Activity, Info, CircleDot 
} from 'lucide-react';
import Navbar from '../../components/manager/Navbar';

// --- Mock Data: Single Detailed Match ---
const MATCH_DATA = {
    id: 1,
    league: 'T20 Premier League • Final',
    status: 'live',
    venue: 'Eden Gardens, Kolkata',
    date: 'Oct 24, 2025',
    toss: 'Royal Strikers won the toss and elected to bat',
    teamA: {
        name: 'Royal Strikers',
        short: 'RST',
        logo: '🦁',
        score: '185/6',
        overs: '20.0',
        color: 'text-yellow-600'
    },
    teamB: {
        name: 'Kings XI',
        short: 'KXI',
        logo: '👑',
        score: '172/4',
        overs: '18.4',
        color: 'text-blue-600'
    },
    situation: {
        message: 'Kings XI need 14 runs in 8 balls',
        crr: '9.21',
        rrr: '10.50',
        target: '186'
    },
    batting: [
        { name: 'V. Kohli', status: 'not out', runs: 82, balls: 48, fours: 6, sixes: 3, sr: 170.8 },
        { name: 'G. Maxwell', status: 'b. Bumrah', runs: 45, balls: 22, fours: 4, sixes: 2, sr: 204.5 },
        { name: 'D. Karthik', status: 'not out', runs: 12, balls: 5, fours: 1, sixes: 1, sr: 240.0 },
    ],
    bowling: [
        { name: 'J. Bumrah', overs: '3.4', maidens: 0, runs: 28, wickets: 2, econ: 7.6 },
        { name: 'R. Rashid', overs: '4.0', maidens: 0, runs: 32, wickets: 1, econ: 8.0 },
    ],
    squads: {
        teamA: ['V. Kohli', 'F. Du Plessis', 'G. Maxwell', 'D. Karthik', 'M. Siraj', 'K. Sharma'],
        teamB: ['R. Sharma', 'I. Kishan', 'S. Yadav', 'H. Pandya', 'J. Bumrah', 'T. David']
    }
};

const ScorecardRow = ({ batter, isHeader = false }) => {
    if (isHeader) {
        return (
            <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs font-semibold uppercase text-muted-foreground bg-muted/30">
                <div className="w-5/12">Batter</div>
                <div className="w-1/12 text-center">R</div>
                <div className="w-1/12 text-center">B</div>
                <div className="w-1/12 text-center hidden sm:block">4s</div>
                <div className="w-1/12 text-center hidden sm:block">6s</div>
                <div className="w-2/12 text-right">SR</div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 text-sm hover:bg-muted/20 transition-colors">
            <div className="w-5/12 flex flex-col">
                <span className="font-semibold">{batter.name}</span>
                <span className="text-xs text-muted-foreground">{batter.status}</span>
            </div>
            <div className="w-1/12 text-center font-bold text-foreground">{batter.runs}</div>
            <div className="w-1/12 text-center text-muted-foreground">{batter.balls}</div>
            <div className="w-1/12 text-center text-muted-foreground hidden sm:block">{batter.fours}</div>
            <div className="w-1/12 text-center text-muted-foreground hidden sm:block">{batter.sixes}</div>
            <div className="w-2/12 text-right text-muted-foreground">{batter.sr}</div>
        </div>
    );
};

const BowlingRow = ({ bowler, isHeader = false }) => {
    if (isHeader) {
        return (
            <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs font-semibold uppercase text-muted-foreground bg-muted/30">
                <div className="w-5/12">Bowler</div>
                <div className="w-1/12 text-center">O</div>
                <div className="w-1/12 text-center">M</div>
                <div className="w-1/12 text-center">R</div>
                <div className="w-1/12 text-center font-bold">W</div>
                <div className="w-2/12 text-right">ECO</div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 text-sm hover:bg-muted/20 transition-colors">
            <div className="w-5/12 font-semibold">{bowler.name}</div>
            <div className="w-1/12 text-center text-muted-foreground">{bowler.overs}</div>
            <div className="w-1/12 text-center text-muted-foreground">{bowler.maidens}</div>
            <div className="w-1/12 text-center text-muted-foreground">{bowler.runs}</div>
            <div className="w-1/12 text-center font-bold text-primary">{bowler.wickets}</div>
            <div className="w-2/12 text-right text-muted-foreground">{bowler.econ}</div>
        </div>
    );
};

const MatchDetailsPage = () => {
    const [activeTab, setActiveTab] = useState('scorecard');

    return (
        <div className="min-h-screen bg-background text-foreground pb-12">
            <Navbar />

            {/* --- Hero Header --- */}
            <div className="relative bg-card border-b border-border shadow-sm">
                
                {/* Top Bar: Navigation & League Info */}
                <div className="mx-auto max-w-5xl px-4 py-4 md:px-6">
                    <div className="flex items-center justify-between mb-6">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ChevronLeft size={18} /> Back
                        </button>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {MATCH_DATA.league}
                        </span>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>

                    {/* Scoreboard Main */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6">
                        {/* Team A */}
                        <div className="flex flex-col items-center gap-3 md:items-start md:flex-row md:gap-5 w-full md:w-auto">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl shadow-inner border border-border">
                                {MATCH_DATA.teamA.logo}
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-xl font-bold opacity-60">{MATCH_DATA.teamA.name}</h2>
                                <div className="mt-1 flex items-baseline justify-center gap-2 md:justify-start">
                                    <span className="text-3xl font-bold text-muted-foreground">{MATCH_DATA.teamA.score}</span>
                                    <span className="text-sm text-muted-foreground">({MATCH_DATA.teamA.overs})</span>
                                </div>
                            </div>
                        </div>

                        {/* VS / Status Area */}
                        <div className="flex flex-col items-center gap-2 text-center min-w-[200px]">
                            <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive animate-pulse">
                                <CircleDot size={10} className="fill-current" /> LIVE
                            </div>
                            <p className="text-sm font-semibold text-primary">{MATCH_DATA.situation.message}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                <span>CRR: <strong className="text-foreground">{MATCH_DATA.situation.crr}</strong></span>
                                <span>RRR: <strong className="text-foreground">{MATCH_DATA.situation.rrr}</strong></span>
                            </div>
                            <span className="text-[10px] uppercase text-muted-foreground">Target: {MATCH_DATA.situation.target}</span>
                        </div>

                        {/* Team B (Active Batting) */}
                        <div className="flex flex-col items-center gap-3 md:items-end md:flex-row-reverse md:gap-5 w-full md:w-auto">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl shadow-inner border-2 border-primary/20 ring-2 ring-primary/10">
                                {MATCH_DATA.teamB.logo}
                            </div>
                            <div className="text-center md:text-right">
                                <h2 className="text-xl font-bold">{MATCH_DATA.teamB.name}</h2>
                                <div className="mt-1 flex items-baseline justify-center gap-2 md:justify-end">
                                    <span className="text-4xl font-bold text-primary">{MATCH_DATA.teamB.score}</span>
                                    <span className="text-sm font-medium">({MATCH_DATA.teamB.overs})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mx-auto max-w-5xl px-4 md:px-6">
                    <div className="flex gap-8 border-t border-border overflow-x-auto">
                        {['scorecard', 'squads', 'info'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative pb-3 pt-3 text-sm font-medium capitalize transition-colors ${
                                    activeTab === tab 
                                    ? 'text-primary' 
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Main Content Area --- */}
            <main className="mx-auto max-w-5xl px-4 pt-6 md:px-6">
                
                {/* TAB: Scorecard */}
                {activeTab === 'scorecard' && (
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            {/* Batting Card */}
                            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                                <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Activity size={16} /> Batting
                                    </h3>
                                    <span className="text-xs text-muted-foreground">{MATCH_DATA.teamB.name} Innings</span>
                                </div>
                                <div className="bg-card">
                                    <ScorecardRow isHeader />
                                    {MATCH_DATA.batting.map((batter, idx) => (
                                        <ScorecardRow key={idx} batter={batter} />
                                    ))}
                                    {/* Yet to bat placeholder */}
                                    <div className="px-4 py-3 text-xs text-muted-foreground italic border-t border-border/50">
                                        Yet to bat: H. Pandya, T. David...
                                    </div>
                                </div>
                            </div>

                            {/* Bowling Card */}
                            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                                <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <CircleDot size={16} /> Bowling
                                    </h3>
                                    <span className="text-xs text-muted-foreground">{MATCH_DATA.teamA.name} Bowling</span>
                                </div>
                                <div className="bg-card">
                                    <BowlingRow isHeader />
                                    {MATCH_DATA.bowling.map((bowler, idx) => (
                                        <BowlingRow key={idx} bowler={bowler} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Match Info */}
                        <div className="md:col-span-1 space-y-6">
                             {/* Match Info Box */}
                            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                                <h4 className="mb-4 text-sm font-bold uppercase text-muted-foreground">Match Info</h4>
                                <ul className="space-y-4 text-sm">
                                    <li className="flex gap-3">
                                        <MapPin size={18} className="text-primary shrink-0" />
                                        <div>
                                            <span className="block font-medium">Venue</span>
                                            <span className="text-muted-foreground">{MATCH_DATA.venue}</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <Calendar size={18} className="text-primary shrink-0" />
                                        <div>
                                            <span className="block font-medium">Date</span>
                                            <span className="text-muted-foreground">{MATCH_DATA.date}</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <Trophy size={18} className="text-primary shrink-0" />
                                        <div>
                                            <span className="block font-medium">Toss</span>
                                            <span className="text-muted-foreground leading-snug">{MATCH_DATA.toss}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Squads */}
                {activeTab === 'squads' && (
                    <div className="grid gap-6 md:grid-cols-2">
                         <div className="rounded-xl border border-border bg-card p-0 shadow-sm overflow-hidden">
                            <div className="bg-secondary/50 p-4 border-b border-border flex items-center gap-3">
                                <div className="text-2xl">{MATCH_DATA.teamA.logo}</div>
                                <h3 className="font-bold">{MATCH_DATA.teamA.name} <span className="text-xs font-normal text-muted-foreground">Playing XI</span></h3>
                            </div>
                            <ul className="divide-y divide-border">
                                {MATCH_DATA.squads.teamA.map((player, i) => (
                                    <li key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20">
                                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                                        <span className="font-medium">{player}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-0 shadow-sm overflow-hidden">
                             <div className="bg-secondary/50 p-4 border-b border-border flex items-center gap-3">
                                <div className="text-2xl">{MATCH_DATA.teamB.logo}</div>
                                <h3 className="font-bold">{MATCH_DATA.teamB.name} <span className="text-xs font-normal text-muted-foreground">Playing XI</span></h3>
                            </div>
                            <ul className="divide-y divide-border">
                                {MATCH_DATA.squads.teamB.map((player, i) => (
                                    <li key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20">
                                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                                        <span className="font-medium">{player}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* TAB: Info */}
                {activeTab === 'info' && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Info size={48} className="mb-4 opacity-20" />
                        <p>Additional match statistics, umpire details, and points table integration.</p>
                    </div>
                )}

            </main>
        </div>
    );
};

export default MatchDetailsPage;