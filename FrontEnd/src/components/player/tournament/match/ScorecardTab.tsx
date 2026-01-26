import { useState, useMemo, useEffect } from "react";
import { BattingTable } from "./BattingTable";
import { BowlingTable } from "./BowlingTable";
import { Users, CircleDot } from "lucide-react";
import type { BattingStats, BowlingStats, LiveScoreState, Match, Team }from "../../../../features/manager/Matches/matchTypes";

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
            <div className="p-8 flex items-center justify-center bg-card rounded-2xl border border-border">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" />
                    <span className="text-muted-foreground font-mono text-sm">Loading Scorecard...</span>
                </div>
            </div>
        );
    }

    // Logic for Data Retrieval based on UI expectation:
    const getDisplayData = () => {
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

    const displayData = getDisplayData();

    console.log(displayData, 'displaydta')

    return (
        <div className="space-y-6">
            {/* --- Control Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30 backdrop-blur-sm p-2 rounded-xl border border-border">
                
                {/* Team Switcher */}
                <div className="flex bg-background p-1 rounded-lg border border-border w-full md:w-auto shadow-sm">
                    <button
                        onClick={() => setSelectedTeam(teamA._id)}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                            selectedTeam === teamA._id 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        {teamA.name}
                    </button>
                    <button
                        onClick={() => setSelectedTeam(teamB._id)}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                            selectedTeam === teamB._id 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        {teamB.name}
                    </button>
                </div>

                {/* Mode Switcher */}
                <div className="flex bg-background p-1 rounded-lg border border-border w-full md:w-auto shadow-sm">
                    <button
                        onClick={() => setViewMode('batting')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                            viewMode === 'batting' 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        <Users size={14} /> Batting
                    </button>
                    <button
                        onClick={() => setViewMode('bowling')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                            viewMode === 'bowling' 
                                ? 'bg-emerald-600 text-white shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        <CircleDot size={14} /> Bowling
                    </button>
                </div>
            </div>

            {/* --- Data Table --- */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm min-h-[400px]">
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