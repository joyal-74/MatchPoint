import React, { useState, useEffect } from 'react';
import { 
    Trophy, 
    User, 
    CircleDot, 
    Activity, 
    AlertCircle,
} from 'lucide-react';
import type { Match, LiveScoreState, Team } from '../../../features/manager/Matches/matchTypes';

interface FullScoreboardTabsProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
}

const FullScoreboardTabs: React.FC<FullScoreboardTabsProps> = ({ match, teamA, teamB, liveScore }) => {
    const [activeInnings, setActiveInnings] = useState<1 | 2>(1);
    const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'extras'>('batting');

    // Default active innings to current innings on load
    useEffect(() => {
        if (liveScore?.currentInnings) {
            setActiveInnings(liveScore.currentInnings as 1 | 2);
        }
    }, [liveScore?.currentInnings]);

    if (!liveScore) {
        return (
            <div className="w-full bg-neutral-950 rounded-2xl border border-neutral-800 p-8 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin text-neutral-600"><Activity /></div>
                <div className="text-neutral-500 font-mono text-md">Loading Scoreboard Data...</div>
            </div>
        );
    }

    const inningsData = activeInnings === 1 ? liveScore.innings1 : (liveScore.innings2 || liveScore.innings1);
    if (!inningsData) return <div className="p-8 text-center text-neutral-500 italic">Innings data not initialized.</div>;

    // Determine Teams
    const battingTeam = inningsData.battingTeamId === teamA._id ? teamA : inningsData.battingTeamId === teamB._id ? teamB : teamA;
    const bowlingTeam = inningsData.bowlingTeamId === teamA._id ? teamA : inningsData.bowlingTeamId === teamB._id ? teamB : teamB;

    // Helpers
    const getPlayerName = (playerId: string): string => {
        const player = [...teamA.members, ...teamB.members].find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const getStrikeRate = (runs: number, balls: number): string => balls === 0 ? '0.00' : ((runs / balls) * 100).toFixed(1);
    const getEconomy = (runs: number, overs: number): string => overs === 0 ? '0.00' : (runs / overs).toFixed(1);

    // --- Components ---

    const TabButton = ({ id, label, icon: Icon, colorClass }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
                flex-1 py-3 flex items-center justify-center gap-2 text-md font-bold border-b-2 transition-all
                ${activeTab === id 
                    ? `text-white ${colorClass} bg-neutral-900/50` 
                    : 'text-neutral-500 border-transparent hover:text-neutral-300 hover:bg-neutral-900/30'
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
                        <tr className="bg-neutral-900 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold border-b border-neutral-800">
                            <th className="py-3 px-4">Batter</th>
                            <th className="py-3 px-2 text-right">R</th>
                            <th className="py-3 px-2 text-right">B</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">4s</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">6s</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">SR</th>
                        </tr>
                    </thead>
                    <tbody className="text-md">
                        {battingStatsArray.map((stat) => {
                            const isStriker = stat.playerId === inningsData.currentBatsmanId;
                            const isNonStriker = stat.playerId === inningsData.nonStrikerId;
                            const isActive = isStriker || isNonStriker;

                            return (
                                <tr key={stat.playerId} className={`border-b border-neutral-800/50 transition-colors ${isActive ? 'bg-blue-900/10' : 'hover:bg-neutral-900/20'}`}>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col">
                                            <span className={`font-bold flex items-center gap-2 ${isActive ? 'text-blue-400' : 'text-white'}`}>
                                                {getPlayerName(stat.playerId)}
                                                {isStriker && <CircleDot size={12} className="animate-pulse fill-current" />}
                                            </span>
                                            <span className={`text-sm ${stat.dismissalType ? 'text-red-400' : 'text-neutral-500'}`}>
                                                {stat.dismissalType || (isActive ? 'Not Out' : 'Did not bat')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-right font-bold text-white font-mono text-base">{stat.runs}</td>
                                    <td className="py-3 px-2 text-right text-neutral-400 font-mono">{stat.balls}</td>
                                    <td className="py-3 px-2 text-right text-neutral-500 font-mono hidden sm:table-cell">{stat.fours}</td>
                                    <td className="py-3 px-2 text-right text-neutral-500 font-mono hidden sm:table-cell">{stat.sixes}</td>
                                    <td className="py-3 px-2 text-right text-neutral-500 font-mono hidden sm:table-cell">{getStrikeRate(stat.runs, stat.balls)}</td>
                                </tr>
                            );
                        })}
                        {/* Empty State if no stats */}
                        {battingStatsArray.length === 0 && (
                            <tr><td colSpan={6} className="py-8 text-center text-neutral-500 italic">No batting data available yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderBowlingScorecard = () => {
        const bowlingStats = Object.entries(inningsData.bowlingStats);

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-900 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold border-b border-neutral-800">
                            <th className="py-3 px-4">Bowler</th>
                            <th className="py-3 px-2 text-right">O</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">M</th>
                            <th className="py-3 px-2 text-right">R</th>
                            <th className="py-3 px-2 text-right">W</th>
                            <th className="py-3 px-2 text-right hidden sm:table-cell">Eco</th>
                        </tr>
                    </thead>
                    <tbody className="text-md">
                        {bowlingStats.map(([playerId, stat]) => {
                            const isCurrentBowler = playerId === inningsData.currentBowlerId;
                            return (
                                <tr key={playerId} className={`border-b border-neutral-800/50 transition-colors ${isCurrentBowler ? 'bg-red-900/10' : 'hover:bg-neutral-900/20'}`}>
                                    <td className="py-3 px-4">
                                        <span className={`font-bold flex items-center gap-2 ${isCurrentBowler ? 'text-red-400' : 'text-white'}`}>
                                            {getPlayerName(playerId)}
                                            {isCurrentBowler && <Activity size={12} className="animate-pulse" />}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 text-right font-mono text-white">{stat.overs.toFixed(1)}</td>
                                    <td className="py-3 px-2 text-right font-mono text-neutral-500 hidden sm:table-cell">{stat.maidens}</td>
                                    <td className="py-3 px-2 text-right font-mono text-neutral-300">{stat.runsConceded}</td>
                                    <td className="py-3 px-2 text-right font-mono font-bold text-red-500">{stat.wickets}</td>
                                    <td className="py-3 px-2 text-right font-mono text-neutral-500 hidden sm:table-cell">{getEconomy(stat.runsConceded, stat.overs)}</td>
                                </tr>
                            );
                        })}
                        {bowlingStats.length === 0 && (
                            <tr><td colSpan={6} className="py-8 text-center text-neutral-500 italic">No bowling data available yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderExtras = () => {
        const extras = inningsData.extras || { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 };
        const totalExtras = (extras.wides || 0) + (extras.noBalls || 0) + (extras.byes || 0) + (extras.legByes || 0) + (extras.penalty || 0);

        const ExtraCard = ({ label, value, color }: any) => (
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col items-center justify-center">
                <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{label}</div>
            </div>
        );

        return (
            <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <ExtraCard label="Wides" value={extras.wides || 0} color="text-white" />
                    <ExtraCard label="No Balls" value={extras.noBalls || 0} color="text-white" />
                    <ExtraCard label="Byes" value={extras.byes || 0} color="text-white" />
                    <ExtraCard label="Leg Byes" value={extras.legByes || 0} color="text-white" />
                    <ExtraCard label="Penalty" value={extras.penalty || 0} color="text-yellow-500" />
                </div>
                
                <div className="mt-6 bg-neutral-900/50 rounded-xl border border-neutral-800 p-4 flex justify-between items-center">
                    <span className="text-md font-semibold text-neutral-400">Total Extras Conceded</span>
                    <span className="text-3xl font-bold text-white">{totalExtras}</span>
                </div>
            </div>
        );
    };

    // --- Main Layout ---

    return (
        <div className="w-full mx-auto bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden font-sans">
            
            {/* 1. Header & Innings Selector */}
            <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-900/30">
                <div className="flex items-center gap-3">
                    <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                        <Trophy size={18} className="text-yellow-500" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg">{battingTeam.name} vs {bowlingTeam.name}</div>
                        <div className="text-sm text-neutral-500">Full Scorecard</div>
                    </div>
                </div>

                {/* Innings Toggle */}
                <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                    <button
                        onClick={() => setActiveInnings(1)}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                            activeInnings === 1 ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        1st Innings
                    </button>
                    <button
                        onClick={() => setActiveInnings(2)}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                            activeInnings === 2 ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        2nd Innings
                    </button>
                </div>
            </div>

            {/* 2. Tab Navigation */}
            <div className="flex border-b border-neutral-800 bg-neutral-950">
                <TabButton id="batting" label="Batting" icon={User} colorClass="border-blue-500" />
                <TabButton id="bowling" label="Bowling" icon={CircleDot} colorClass="border-red-500" />
                <TabButton id="extras" label="Extras" icon={AlertCircle} colorClass="border-yellow-500" />
            </div>

            {/* 3. Content Area */}
            <div className="min-h-[300px] bg-neutral-950">
                {activeTab === 'batting' && renderBattingScorecard()}
                {activeTab === 'bowling' && renderBowlingScorecard()}
                {activeTab === 'extras' && renderExtras()}
            </div>
            
            {/* 4. Footer Summary */}
            <div className="bg-neutral-900/50 p-3 border-t border-neutral-800 text-center text-sm text-neutral-500">
                Showing stats for Innings {activeInnings} • {battingTeam.name} Batting
            </div>
        </div>
    );
};

export default FullScoreboardTabs;