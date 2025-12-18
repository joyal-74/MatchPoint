import { useState, useMemo, useEffect } from "react";
import { BattingTable } from "./BattingTable";
import { BowlingTable } from "./BowlingTable";
import { Users, CircleDot } from "lucide-react";
import type { BattingStats, BowlingStats, LiveScoreState, Match, Team } from "../../../features/manager/Matches/matchTypes";

interface ScorecardTabProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
    getPlayerName: (id: string) => string;
    getPlayerRole: (id: string) => string;
}

export const ScorecardTab = ({ match, teamA, liveScore, teamB, getPlayerName, getPlayerRole }: ScorecardTabProps) => {
    const [viewMode, setViewMode] = useState<'batting' | 'bowling'>('batting');
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

    // Auto-select batting team on load
    useEffect(() => {
        if (!selectedTeam && liveScore?.innings1?.battingTeam) {
            setSelectedTeam(liveScore.innings1.battingTeam);
        }
    }, [liveScore?.innings1?.battingTeam, selectedTeam]);

    // Memoize first batting team
    const { firstBattingTeamId } = useMemo(() => {
        if (!liveScore?.innings1?.battingTeam) return { firstBattingTeamId: null };
        return { firstBattingTeamId: liveScore.innings1.battingTeam };
    }, [liveScore?.innings1?.battingTeam]);

    // Loading State
    if (!teamA?._id || !teamB?._id || !match || !liveScore) {
        return (
            <div className="p-8 flex items-center justify-center bg-neutral-900 rounded-2xl border border-neutral-800">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-neutral-600 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-neutral-500 font-mono text-sm">Loading Scorecard...</span>
                </div>
            </div>
        );
    }

    const getDisplayData = ():
        | { stats: BattingStats[]; legalBalls: number; teamName: string; type: 'batting' }
        | { stats: BowlingStats[]; currentBowlerId: string | null | undefined; teamName: string; type: 'bowling' } => {

        const isFirstBattingTeam = selectedTeam === firstBattingTeamId;
        const isTeamASelected = selectedTeam === teamA._id;
        const selectedTeamName = isTeamASelected ? teamA.name : teamB.name;
        const opponentTeamName = isTeamASelected ? teamB.name : teamA.name;

        // Determine which innings corresponds to the selected team's batting/bowling
        let battingInnings, bowlingInnings;
        
        if (isFirstBattingTeam) {
            // Selected team batted first
            battingInnings = liveScore.innings1;
            bowlingInnings = liveScore.innings2 || null; 
        } else {
            // Selected team batted second
            battingInnings = liveScore.innings2 || null;
            bowlingInnings = liveScore.innings1;
        }

        if (viewMode === 'batting') {
            const statsArray: BattingStats[] = battingInnings?.battingStats || [];
            return {
                stats: statsArray,
                legalBalls: battingInnings?.legalBalls || 0,
                teamName: selectedTeamName,
                type: 'batting' as const
            };
        } else {
            const statsArray: BowlingStats[] = bowlingInnings?.bowlingStats || [];
            return {
                stats: statsArray,
                currentBowlerId: liveScore.currentInnings === 1
                    ? liveScore.innings1?.currentBowler
                    : liveScore.innings2?.currentBowler,
                teamName: opponentTeamName, // Bowling stats belong to the opponent's bowling effort against selected team? 
                // Wait, logic check: 
                // If I select "Team A" and click "Bowling", I want to see Team A's bowlers.
                // Team A bowls when Team B bats.
                // So we need the innings where Team A was bowling.
                // If Team A batted first (innings 1), they bowled second (innings 2).
                
                type: 'bowling' as const
            };
        }
    };

    // Correct Logic for Bowling Data Retrieval based on UI expectation:
    const getCorrectBowlingStats = () => {
        const isTeamASelected = selectedTeam === teamA._id;
        const selectedTeamName = isTeamASelected ? teamA.name : teamB.name;
        
        if (viewMode === 'batting') {
            // Show selected team's batting
            const innings = isTeamASelected 
                ? (firstBattingTeamId === teamA._id ? liveScore.innings1 : liveScore.innings2)
                : (firstBattingTeamId === teamB._id ? liveScore.innings1 : liveScore.innings2);

            return {
                stats: innings?.battingStats || [],
                legalBalls: innings?.legalBalls || 0,
                teamName: selectedTeamName,
                type: 'batting' as const
            };
        } else {
            // Show selected team's bowling
            // Team A bowls during Team B's batting innings.
            const opponentBattingInnings = isTeamASelected
                ? (firstBattingTeamId === teamB._id ? liveScore.innings1 : liveScore.innings2)
                : (firstBattingTeamId === teamA._id ? liveScore.innings1 : liveScore.innings2);
            
            return {
                stats: opponentBattingInnings?.bowlingStats || [],
                currentBowlerId: liveScore.currentInnings === 1 ? liveScore.innings1?.currentBowler : liveScore.innings2?.currentBowler,
                teamName: selectedTeamName,
                type: 'bowling' as const
            }
        }
    }

    const displayData = getCorrectBowlingStats();

    return (
        <div className="space-y-6">
            {/* --- Control Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-900/50 backdrop-blur-md p-2 rounded-2xl border border-white/5">
                
                {/* Team Switcher */}
                <div className="flex bg-black/40 p-1 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setSelectedTeam(teamA._id)}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                            selectedTeam === teamA._id 
                                ? 'bg-neutral-700 text-white shadow-lg' 
                                : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        {teamA.name}
                    </button>
                    <button
                        onClick={() => setSelectedTeam(teamB._id)}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                            selectedTeam === teamB._id 
                                ? 'bg-neutral-700 text-white shadow-lg' 
                                : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        {teamB.name}
                    </button>
                </div>

                {/* Mode Switcher */}
                <div className="flex bg-black/40 p-1 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setViewMode('batting')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            viewMode === 'batting' 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        <Users size={14} /> Batting
                    </button>
                    <button
                        onClick={() => setViewMode('bowling')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            viewMode === 'bowling' 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                                : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                        <CircleDot size={14} /> Bowling
                    </button>
                </div>
            </div>

            {/* --- Data Table --- */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl min-h-[400px]">
                {displayData.type === 'batting' ? (
                    <BattingTable
                        stats={displayData.stats as BattingStats[]}
                        teamName={displayData.teamName}
                        balls={displayData.legalBalls}
                        getPlayerName={getPlayerName}
                        getPlayerRole={getPlayerRole}
                    />
                ) : (
                    <BowlingTable
                        stats={displayData.stats as BowlingStats[]}
                        currentBowlerId={displayData.currentBowlerId}
                        teamName={displayData.teamName}
                        getPlayerName={getPlayerName}
                    />
                )}
            </div>
        </div>
    );
};