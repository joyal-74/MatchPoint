import { useState, useMemo, useEffect } from "react";
import { BattingTable } from "./BattingTable";
import { BowlingTable } from "./BowlingTable";
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
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    console.log(liveScore, "score");

    useEffect(() => {
        if (!selectedTeamId && liveScore?.innings1?.battingTeamId) {
            setSelectedTeamId(liveScore.innings1.battingTeamId);
        }
    }, [liveScore?.innings1?.battingTeamId, selectedTeamId]);

    const { firstBattingTeamId } = useMemo(() => {
        if (!liveScore?.innings1?.battingTeamId) return { firstBattingTeamId: null };

        return { firstBattingTeamId: liveScore.innings1.battingTeamId };
    }, [liveScore?.innings1?.battingTeamId]);

    if (!teamA?._id || !teamB?._id || !match || !liveScore) {
        return (
            <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-neutral-700 rounded w-1/3"></div>
                    <div className="h-4 bg-neutral-700 rounded"></div>
                    <div className="h-4 bg-neutral-700 rounded w-5/6"></div>
                    <div className="h-4 bg-neutral-700 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    const getDisplayData = ():
        | { stats: BattingStats[]; legalBalls: number; teamName: string; type: 'batting' }
        | { stats: BowlingStats[]; currentBowlerId: string | null | undefined; teamName: string; type: 'bowling' } => {

        const isFirstBattingTeam = selectedTeamId === firstBattingTeamId;
        const isTeamASelected = selectedTeamId === teamA._id;
        const selectedTeamName = isTeamASelected ? teamA.name : teamB.name;
        const opponentTeamName = isTeamASelected ? teamB.name : teamA.name;

        let battingInnings, bowlingInnings;
        if (isFirstBattingTeam) {
            battingInnings = liveScore.innings1;
            bowlingInnings = liveScore.innings2 || null;
        } else {
            battingInnings = liveScore.innings2 || null;
            bowlingInnings = liveScore.innings1;
        }

        if (viewMode === 'batting') {
            // Already an array, no conversion needed
            const statsArray: BattingStats[] = battingInnings?.battingStats || [];

            return {
                stats: statsArray,
                legalBalls: battingInnings?.legalBalls || 0,
                teamName: selectedTeamName,
                type: 'batting' as const
            };
        } else {
            // Already an array, no conversion needed
            const statsArray: BowlingStats[] = bowlingInnings?.bowlingStats || [];

            return {
                stats: statsArray,
                currentBowlerId: liveScore.currentInnings === 1
                    ? liveScore.innings1?.currentBowler
                    : liveScore.innings2?.currentBowler,
                teamName: opponentTeamName,
                type: 'bowling' as const
            };
        }
    };

    const displayData = getDisplayData();

    return (
        <div className="space-y-6">
            {/* Control Bar */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 flex flex-wrap gap-4 justify-between items-center">

                {/* Team Selectors */}
                <div className="flex space-x-1 bg-neutral-900 p-1 rounded-lg">
                    <button
                        onClick={() => setSelectedTeamId(teamA._id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTeamId === teamA._id ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                        {teamA.name}
                    </button>
                    <button
                        onClick={() => setSelectedTeamId(teamB._id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTeamId === teamB._id ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                        {teamB.name}
                    </button>
                </div>

                {/* View Mode Selectors */}
                <div className="flex space-x-1 bg-neutral-900 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('batting')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'batting' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                        Batting
                    </button>
                    <button
                        onClick={() => setViewMode('bowling')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'bowling' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
                    >
                        Bowling
                    </button>
                </div>
            </div>

            {/* Render View */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                {viewMode === 'batting' && displayData.type === 'batting' ? (
                    <BattingTable
                        stats={displayData.stats}
                        teamName={displayData.teamName}
                        balls={displayData.legalBalls}
                        getPlayerName={getPlayerName}
                        getPlayerRole={getPlayerRole}
                    />
                ) : displayData.type === 'bowling' ? (
                    <BowlingTable
                        stats={displayData.stats}
                        currentBowlerId={displayData.currentBowlerId}
                        teamName={displayData.teamName}
                        getPlayerName={getPlayerName}
                    />
                ) : null}
            </div>
        </div>
    );
};