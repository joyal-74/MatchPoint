import React, { useState, useEffect } from 'react';
import { Trophy, User, CircleDot, Activity, AlertCircle } from 'lucide-react';
import type { LiveScoreState, Team } from '../../../features/manager/Matches/matchTypes';

interface FullScoreboardTabsProps {
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
}

interface TabButtonProps {
    id: 'batting' | 'bowling' | 'extras';
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

const FullScoreboardTabs: React.FC<FullScoreboardTabsProps> = ({ teamA, teamB, liveScore }) => {
    const [activeInnings, setActiveInnings] = useState<1 | 2>(1);
    const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'extras'>('batting');

    useEffect(() => {
        if (liveScore?.currentInnings) {
            setActiveInnings(liveScore.currentInnings as 1 | 2);
        }
    }, [liveScore?.currentInnings]);

    // --- Loading State (Themed) ---
    if (!liveScore) {
        return (
            <div className="w-full bg-card rounded-2xl border border-border p-8 flex flex-col items-center justify-center space-y-4 shadow-sm">
                <div className="animate-spin text-primary"><Activity /></div>
                <div className="text-muted-foreground font-mono text-md">Loading Scoreboard Data...</div>
            </div>
        );
    }

    const inningsData = activeInnings === 1 ? liveScore.innings1 : (liveScore.innings2 || liveScore.innings1);
    if (!inningsData) return <div className="p-8 text-center text-muted-foreground italic bg-card rounded-xl border border-border">Innings data not initialized.</div>;

    // Determine Teams
    const battingTeam = inningsData.battingTeam === teamA._id ? teamA : inningsData.battingTeam === teamB._id ? teamB : teamA;
    const bowlingTeam = inningsData.bowlingTeam === teamA._id ? teamA : inningsData.bowlingTeam === teamB._id ? teamB : teamB;

    // Helpers
    const getPlayerName = (playerId: string | null): string => {
        if (!playerId) return '-';
        const player = [...teamA.members, ...teamB.members].find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const getStrikeRate = (runs: number, balls: number): string => balls === 0 ? '0.00' : ((runs / balls) * 100).toFixed(1);
    const getEconomy = (runs: number, overs: number): string => overs === 0 ? '0.00' : (runs / overs).toFixed(1);

    // --- Components ---

    const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
                flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold border-b-2 transition-all
                ${activeTab === id
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30'
                }
            `}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    // --- Renderers ---

    const renderBattingScorecard = () => {
        const battingStatsArray = Array.isArray(inningsData.battingStats)
            ? inningsData.battingStats
            : Object.values(inningsData.battingStats || {});

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
                            <th className="py-3 px-4">Batter</th>
                            <th className="py-3 px-2 text-right">R</th>
                            <th className="py-3 px-2 text-right">B</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">4s</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">6s</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">SR</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {battingStatsArray.map((stat: any) => {
                            const isStriker = stat.playerId === inningsData.currentStriker;
                            const isNonStriker = stat.playerId === inningsData.currentNonStriker;
                            const isActive = isStriker || isNonStriker;

                            return (
                                <tr key={stat.playerId} className={`border-b border-border/50 transition-colors ${isActive ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col">
                                            <span className={`font-bold flex items-center gap-2 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                                {getPlayerName(stat.playerId)}
                                                {isStriker && <CircleDot size={12} className="animate-pulse fill-current" />}
                                            </span>
                                            <span className={`text-xs ${stat.dismissalType ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                {stat.dismissalType || (isActive ? 'Not Out' : 'Did not bat')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-right font-bold text-foreground font-mono text-base">{stat.runs}</td>
                                    <td className="py-3 px-2 text-right text-muted-foreground font-mono">{stat.balls}</td>
                                    <td className="py-3 px-2 text-right text-muted-foreground font-mono hidden sm:table-cell">{stat.fours}</td>
                                    <td className="py-3 px-2 text-right text-muted-foreground font-mono hidden sm:table-cell">{stat.sixes}</td>
                                    <td className="py-3 px-2 text-right text-muted-foreground font-mono hidden sm:table-cell">{getStrikeRate(stat.runs, stat.balls)}</td>
                                </tr>
                            );
                        })}
                        {battingStatsArray.length === 0 && (
                            <tr><td colSpan={6} className="py-8 text-center text-muted-foreground italic">No batting data available yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderBowlingScorecard = () => {
        const bowlingStatsArray = Array.isArray(inningsData.bowlingStats)
            ? inningsData.bowlingStats
            : Object.values(inningsData.bowlingStats || {});

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
                            <th className="py-3 px-4">Bowler</th>
                            <th className="py-3 px-2 text-right">O</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">M</th>
                            <th className="py-3 px-2 text-right">R</th>
                            <th className="py-3 px-2 text-right">W</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">Eco</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {bowlingStatsArray.map((stat: any) => {
                            const isCurrentBowler = stat.playerId === inningsData.currentBowler;
                            return (
                                <tr key={stat.playerId} className={`border-b border-border/50 transition-colors ${isCurrentBowler ? 'bg-destructive/5' : 'hover:bg-muted/20'}`}>
                                    <td className="py-3 px-4">
                                        <span className={`font-bold flex items-center gap-2 ${isCurrentBowler ? 'text-destructive' : 'text-foreground'}`}>
                                            {getPlayerName(stat.playerId)}
                                            {isCurrentBowler && <Activity size={12} className="animate-pulse" />}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 text-right font-mono text-foreground">{stat.overs}</td>
                                    <td className="py-3 px-2 text-right font-mono text-muted-foreground hidden sm:table-cell">{stat.maidens}</td>
                                    <td className="py-3 px-2 text-right font-mono text-muted-foreground">{stat.runsConceded}</td>
                                    <td className="py-3 px-2 text-right font-mono font-bold text-destructive">{stat.wickets}</td>
                                    <td className="py-3 px-2 text-right font-mono text-muted-foreground hidden sm:table-cell">{getEconomy(stat.runsConceded, stat.overs)}</td>
                                </tr>
                            );
                        })}
                        {bowlingStatsArray.length === 0 && (
                            <tr><td colSpan={6} className="py-8 text-center text-muted-foreground italic">No bowling data available yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderExtras = () => {
        const extras = inningsData.extras || { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 };
        const totalExtras = (extras.wides || 0) + (extras.noBalls || 0) + (extras.byes || 0) + (extras.legByes || 0) + (extras.penalty || 0);

        const ExtraCard = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
            <div className="bg-muted/20 border border-border p-4 rounded-xl flex flex-col items-center justify-center">
                <div className={`text-2xl font-bold mb-1 ${highlight ? 'text-destructive' : 'text-foreground'}`}>{value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
            </div>
        );

        return (
            <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <ExtraCard label="Wides" value={extras.wides || 0} />
                    <ExtraCard label="No Balls" value={extras.noBalls || 0} />
                    <ExtraCard label="Byes" value={extras.byes || 0} />
                    <ExtraCard label="Leg Byes" value={extras.legByes || 0} />
                    <ExtraCard label="Penalty" value={extras.penalty || 0} highlight />
                </div>

                <div className="mt-6 bg-muted/40 rounded-xl border border-border p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-muted-foreground">Total Extras Conceded</span>
                    <span className="text-3xl font-bold text-foreground">{totalExtras}</span>
                </div>
            </div>
        );
    };

    // --- Main Layout ---

    return (
        <div className="w-full mx-auto bg-card rounded-2xl border border-border shadow-sm overflow-hidden font-sans">

            {/* 1. Header & Innings Selector */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="bg-card p-2 rounded-lg border border-border shadow-sm">
                        <Trophy size={18} className="text-primary" />
                    </div>
                    <div>
                        <div className="text-foreground font-bold text-lg">{battingTeam.name} vs {bowlingTeam.name}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Full Scorecard</div>
                    </div>
                </div>

                {/* Innings Toggle (Themed) */}
                <div className="flex bg-muted p-1 rounded-lg border border-border">
                    {[1, 2].map((inning) => (
                        <button
                            key={inning}
                            onClick={() => setActiveInnings(inning as 1 | 2)}
                            className={`
                                px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wide
                                ${activeInnings === inning 
                                    ? 'bg-card text-foreground shadow-sm ring-1 ring-border' 
                                    : 'text-muted-foreground hover:text-foreground'
                                }
                            `}
                        >
                            {inning === 1 ? '1st' : '2nd'} Innings
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Tab Navigation */}
            <div className="flex border-b border-border bg-card">
                <TabButton id="batting" label="Batting" icon={User} />
                <TabButton id="bowling" label="Bowling" icon={CircleDot} />
                <TabButton id="extras" label="Extras" icon={AlertCircle} />
            </div>

            {/* 3. Content Area */}
            <div className="min-h-[300px] bg-card">
                {activeTab === 'batting' && renderBattingScorecard()}
                {activeTab === 'bowling' && renderBowlingScorecard()}
                {activeTab === 'extras' && renderExtras()}
            </div>

            {/* 4. Footer Summary */}
            <div className="bg-muted/30 p-3 border-t border-border text-center text-xs text-muted-foreground">
                Showing stats for Innings {activeInnings} • <span className="font-semibold text-foreground">{battingTeam.name}</span> Batting
            </div>
        </div>
    );
};

export default FullScoreboardTabs;