import { useState } from "react";
import { MapPin, Clock, Wind, CircleDot, Share2, ArrowLeft, Shield } from "lucide-react";

const MATCH_DATA = {
    id: "m1",
    status: "completed",
    result: "Royal Strikers won by 14 runs",
    toss: "Galaxy Warriors won the toss and elected to bowl",
    venue: "Greenfield International Stadium, Trivandrum",
    date: "2025-10-15T14:30:00",
    umpires: "H. Sena, K. Dharmsena",
    teamA: {
        name: "Royal Strikers",
        short: "RYS",
        logo: null,
        score: "186/4",
        overs: "20.0"
    },
    teamB: {
        name: "Galaxy Warriors",
        short: "GLX",
        logo: null,
        score: "172/8",
        overs: "20.0"
    }
};


const BattingRow = ({ name, r, b, fours, sixes, sr, status }: any) => (
    <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
        <td className="py-3 pl-4">
            <div className="font-bold text-sm text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground">{status}</div>
        </td>
        <td className="text-center font-bold text-foreground">{r}</td>
        <td className="text-center text-muted-foreground">{b}</td>
        <td className="text-center text-muted-foreground hidden sm:table-cell">{fours}</td>
        <td className="text-center text-muted-foreground hidden sm:table-cell">{sixes}</td>
        <td className="text-right pr-4 text-xs font-mono text-muted-foreground">{sr}</td>
    </tr>
);

// 2. Bowling Row
const BowlingRow = ({ name, o, m, r, w, eco }: any) => (
    <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
        <td className="py-3 pl-4 font-medium text-sm text-foreground">{name}</td>
        <td className="text-center text-muted-foreground">{o}</td>
        <td className="text-center text-muted-foreground hidden sm:table-cell">{m}</td>
        <td className="text-center text-muted-foreground">{r}</td>
        <td className="text-center font-bold text-primary">{w}</td>
        <td className="text-right pr-4 text-xs font-mono text-muted-foreground">{eco}</td>
    </tr>
);

// 3. Squad List Item
const SquadItem = ({ name, role }: { name: string, role: string }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {name.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-semibold">{name}</span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
            {role}
        </span>
    </div>
);

export default function MatchDetailsPage() {
    const [activeTab, setActiveTab] = useState<"scorecard" | "squads" | "info">("scorecard");
    const [activeInnings, setActiveInnings] = useState(1);

    const isLive = MATCH_DATA.status === "ongoing";

    return (
        <div className="min-h-screen bg-background pb-12">

            {/* ================= 1. HERO HEADER ================= */}
            <div className="relative bg-[#0f172a] text-white overflow-hidden pb-8 pt-4">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 container mx-auto px-4 max-w-4xl">
                    {/* Top Nav */}
                    <div className="flex justify-between items-center mb-8">
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                            T20 Series • Match 12
                        </div>
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>

                    {/* Score Board Main */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                        {/* Team A */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center font-bold text-xl">
                                    {MATCH_DATA.teamA.short[0]}
                                </div>
                                <h2 className="text-2xl font-bold">{MATCH_DATA.teamA.name}</h2>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">{MATCH_DATA.teamA.score}</span>
                                <span className="text-lg text-white/60 font-mono">({MATCH_DATA.teamA.overs})</span>
                            </div>
                        </div>

                        {/* VS / Result Center */}
                        <div className="flex flex-col items-center justify-center">
                            {isLive ? (
                                <div className="px-3 py-1 bg-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse mb-2">
                                    Live
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/40 mb-2 border border-white/10">
                                    VS
                                </div>
                            )}
                            <div className="text-center">
                                <p className="text-sm font-medium text-blue-200">{MATCH_DATA.result}</p>
                            </div>
                        </div>

                        {/* Team B */}
                        <div className="flex flex-col items-center md:items-end text-center md:text-right">
                            <div className="flex flex-row-reverse md:flex-row items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-white/80">{MATCH_DATA.teamB.name}</h2>
                                <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center font-bold text-xl text-white/60">
                                    {MATCH_DATA.teamB.short[0]}
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 opacity-80">
                                <span className="text-lg text-white/60 font-mono">({MATCH_DATA.teamB.overs})</span>
                                <span className="text-4xl font-black">{MATCH_DATA.teamB.score}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= 2. MATCH INFO STRIP ================= */}
            <div className="bg-card border-b border-border shadow-sm mb-6">
                <div className="container mx-auto max-w-4xl px-4 py-3">
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CircleDot size={14} className="text-orange-500" />
                            <span>{MATCH_DATA.toss}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-primary" />
                            <span>{MATCH_DATA.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-blue-500" />
                            <span>{new Date(MATCH_DATA.date).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= 3. CONTENT AREA ================= */}
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-border overflow-x-auto no-scrollbar">
                    {["scorecard", "squads", "info"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* --- TAB: SCORECARD --- */}
                {activeTab === "scorecard" && (
                    <div className="animate-in fade-in duration-300 space-y-8">

                        {/* Innings Toggle */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-muted p-1 rounded-xl inline-flex">
                                <button
                                    onClick={() => setActiveInnings(1)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeInnings === 1 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {MATCH_DATA.teamA.short} Innings
                                </button>
                                <button
                                    onClick={() => setActiveInnings(2)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeInnings === 2 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {MATCH_DATA.teamB.short} Innings
                                </button>
                            </div>
                        </div>

                        {/* Batting Card */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center">
                                <h3 className="font-bold text-sm flex items-center gap-2">
                                    <Shield size={14} className="text-primary" /> Batting
                                </h3>
                                <span className="text-xs font-mono text-muted-foreground">Runs (Balls)</span>
                            </div>
                            <table className="w-full">
                                <thead className="text-[10px] uppercase text-muted-foreground bg-muted/20 border-b border-border">
                                    <tr>
                                        <th className="py-2 pl-4 text-left">Batter</th>
                                        <th className="py-2 w-10 text-center">R</th>
                                        <th className="py-2 w-10 text-center">B</th>
                                        <th className="py-2 w-10 text-center hidden sm:table-cell">4s</th>
                                        <th className="py-2 w-10 text-center hidden sm:table-cell">6s</th>
                                        <th className="py-2 pr-4 text-right w-16">SR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <BattingRow name="John Doe" r={45} b={32} fours={4} sixes={1} sr={140.6} status="c Keeper b Bowler" />
                                    <BattingRow name="Rahul K" r={82} b={55} fours={8} sixes={3} sr={149.0} status="not out" />
                                    <BattingRow name="Smith S" r={12} b={10} fours={1} sixes={0} sr={120.0} status="lbw b Bowler" />
                                </tbody>
                            </table>
                            <div className="px-4 py-3 bg-muted/20 text-xs flex justify-between font-bold border-t border-border">
                                <span>Extras</span>
                                <span>12 (wd 8, lb 2, nb 2)</span>
                            </div>
                            <div className="px-4 py-3 bg-primary/5 text-sm flex justify-between font-bold border-t border-border">
                                <span>Total Score</span>
                                <span>{activeInnings === 1 ? MATCH_DATA.teamA.score : MATCH_DATA.teamB.score} <span className="text-muted-foreground font-normal">({activeInnings === 1 ? MATCH_DATA.teamA.overs : MATCH_DATA.teamB.overs} Ov)</span></span>
                            </div>
                        </div>

                        {/* Bowling Card */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-muted/30 px-4 py-3 border-b border-border">
                                <h3 className="font-bold text-sm flex items-center gap-2">
                                    <Wind size={14} className="text-blue-500" /> Bowling
                                </h3>
                            </div>
                            <table className="w-full">
                                <thead className="text-[10px] uppercase text-muted-foreground bg-muted/20 border-b border-border">
                                    <tr>
                                        <th className="py-2 pl-4 text-left">Bowler</th>
                                        <th className="py-2 w-10 text-center">O</th>
                                        <th className="py-2 w-10 text-center hidden sm:table-cell">M</th>
                                        <th className="py-2 w-10 text-center">R</th>
                                        <th className="py-2 w-10 text-center">W</th>
                                        <th className="py-2 pr-4 text-right w-16">ECO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <BowlingRow name="Star Bowler" o={4} m={0} r={28} w={2} eco={7.0} />
                                    <BowlingRow name="Spinner X" o={4} m={1} r={22} w={1} eco={5.5} />
                                    <BowlingRow name="Pacer Y" o={3} m={0} r={35} w={0} eco={11.6} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TAB: SQUADS --- */}
                {activeTab === "squads" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                        <div className="space-y-3">
                            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                {MATCH_DATA.teamA.name}
                            </h3>
                            <SquadItem name="John Doe" role="C" />
                            <SquadItem name="Rahul K" role="WK" />
                            <SquadItem name="Smith S" role="Bat" />
                            <SquadItem name="Pacer Y" role="Bowl" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                {MATCH_DATA.teamB.name}
                            </h3>
                            <SquadItem name="David M" role="C" />
                            <SquadItem name="Kohli V" role="Bat" />
                            <SquadItem name="Bumrah J" role="Bowl" />
                            <SquadItem name="Pant R" role="WK" />
                        </div>
                    </div>
                )}

                {/* --- TAB: INFO --- */}
                {activeTab === "info" && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Match</p>
                                <p className="font-medium">Match 12, T20 Championship</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Date</p>
                                <p className="font-medium">{new Date(MATCH_DATA.date).toDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Toss</p>
                                <p className="font-medium">{MATCH_DATA.toss}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Venue</p>
                                <p className="font-medium">{MATCH_DATA.venue}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Umpires</p>
                                <p className="font-medium">{MATCH_DATA.umpires}</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}