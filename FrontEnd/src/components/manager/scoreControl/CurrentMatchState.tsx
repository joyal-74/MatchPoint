import React from 'react';
import type { Match, LiveScoreState, Team } from '../../../features/manager/Matches/matchTypes';

interface CurrentMatchStateProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
}

const CurrentMatchState: React.FC<CurrentMatchStateProps> = ({ match, teamA, teamB, liveScore }) => {

    if (!liveScore) {
        return (
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-lg">
                <div className="animate-pulse text-center py-8">
                    <div className="h-4 bg-neutral-700 rounded w-1/4 mx-auto mb-4"></div>
                    <div className="h-8 bg-neutral-700 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        );
    }

    const currentInnings = liveScore.currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;
    if (!currentInnings) return <div className="text-neutral-400 p-4">Waiting for innings to start...</div>;

    const getBattingTeam = (): Team => {
        return match.teamA._id === currentInnings.battingTeamId ? match.teamA : match.teamB;
    };

    const getBowlingTeam = (): Team => {
        return match.teamA._id === currentInnings.bowlingTeamId ? match.teamA : match.teamB;
    };

    const battingTeam = getBattingTeam();
    const bowlingTeam = getBowlingTeam();

    const getPlayerName = (playerId: string | null): string => {
        if (!playerId) return 'TBD';
        const player = [...teamA.members, ...teamB.members].find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const toArray = (data: any) => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") return Object.values(data);
        return [];
    };

    const battingStatsArray = toArray(currentInnings.battingStats);
    const bowlingStatsArray = toArray(currentInnings.bowlingStats);

    const strikerStats =
        battingStatsArray.find(s => s.playerId === currentInnings.currentBatsmanId)
        || { runs: 0, balls: 0, fours: 0, sixes: 0 };

    const nonStrikerStats =
        battingStatsArray.find(s => s.playerId === currentInnings.nonStrikerId)
        || { runs: 0, balls: 0, fours: 0, sixes: 0 };

    const bowlerStats =
        bowlingStatsArray.find(s => s.playerId === currentInnings.currentBowlerId)
        || { overs: 0, maidens: 0, wickets: 0, runsConceded: 0 };

    const currentOverDisplay = `${Math.floor(currentInnings.overs)}.${currentInnings.ballsInOver}`;

    // Calculate bowler's overs display (e.g., 3.4)
    const calculateOversDisplay = (overs: number): string => {
        const fullOvers = Math.floor(overs);
        const balls = Math.round((overs % 1) * 10);
        return `${fullOvers}.${balls}`;
    };

    const bowlerOversDisplay = calculateOversDisplay(bowlerStats.overs);
    const economy = bowlerStats.overs > 0 ? (bowlerStats.runsConceded / bowlerStats.overs).toFixed(2) : '0.00';

    // Determine match status based on toss
    const getMatchInfo = () => {
        if (!match.tossWinner || !match.tossDecision) return null;

        const tossWinner = match.tossWinner === match.teamA._id ? match.teamA : match.teamB;
        const decision = match.tossDecision;
        const battingFirst = decision === 'Batting' ? tossWinner :
            (tossWinner._id === match.teamA._id ? match.teamB : match.teamA);

        return { tossWinner, decision, battingFirst };
    };

    const matchInfo = getMatchInfo();

    return (
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-lg">
            {/* Match Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-300">Live Match</h3>
                        <p className="text-sm text-neutral-400"> Match #{match.matchNumber}</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block px-3 py-1 bg-red-500 rounded-full text-xs font-bold">
                            LIVE
                        </div>
                        <p className="text-sm text-neutral-400 mt-1">Innings {liveScore.currentInnings}</p>
                    </div>
                </div>

                {/* Teams Display */}
                <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{battingTeam.name}</div>
                        <div className="text-sm text-neutral-400">Batting</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{bowlingTeam.name}</div>
                        <div className="text-sm text-neutral-400">Bowling</div>
                    </div>
                </div>

                {matchInfo && (
                    <div className="bg-neutral-800/50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-neutral-300">
                            <span className="font-semibold">{matchInfo.tossWinner.name}</span> won the toss and chose to{' '}
                            <span className="font-semibold">{matchInfo.decision}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Main Score Display */}
            <div className="bg-neutral-800/50 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <div className="text-4xl font-bold text-white">
                            {currentInnings.score}<span className="text-neutral-400">/{currentInnings.wickets}</span>
                        </div>
                        <div className="text-lg text-neutral-300">
                            Overs: <span className="font-bold">{currentOverDisplay}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-blue-400">
                            CRR: <span>{(currentInnings.score / (currentInnings.overs + currentInnings.ballsInOver / 6)).toFixed(2) || 0}</span>
                        </div>
                        {liveScore.currentInnings === 2 && (
                            <div className="text-lg text-yellow-400">
                                RR: <span>{liveScore.requiredRunRate.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Extras */}
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-neutral-700/50 p-2 rounded">
                        <div className="text-xs text-neutral-400">Wides</div>
                        <div className="font-bold">{currentInnings.extras?.wides || 0}</div>
                    </div>
                    <div className="bg-neutral-700/50 p-2 rounded">
                        <div className="text-xs text-neutral-400">No Balls</div>
                        <div className="font-bold">{currentInnings.extras?.noBalls || 0}</div>
                    </div>
                    <div className="bg-neutral-700/50 p-2 rounded">
                        <div className="text-xs text-neutral-400">Byes</div>
                        <div className="font-bold">{currentInnings.extras?.byes || 0}</div>
                    </div>
                    <div className="bg-neutral-700/50 p-2 rounded">
                        <div className="text-xs text-neutral-400">Leg Byes</div>
                        <div className="font-bold">{currentInnings.extras?.legByes || 0}</div>
                    </div>
                </div>
            </div>

            {/* Current Players */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Batsmen */}
                <div className="space-y-4">
                    <div className="bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-green-400">STRIKER</span>
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">On Strike</span>
                        </div>
                        <div className="font-bold text-lg">{getPlayerName(currentInnings.currentBatsmanId)}</div>
                        <div className="text-sm text-neutral-300 mt-2">
                            {strikerStats.runs} ({strikerStats.balls}) • {strikerStats.fours}×4 • {strikerStats.sixes}×6
                        </div>
                    </div>

                    <div className="bg-neutral-800/50 p-4 rounded-lg border-l-4 border-neutral-500">
                        <div className="text-sm font-semibold text-neutral-400 mb-2">NON-STRIKER</div>
                        <div className="font-bold text-lg">{getPlayerName(currentInnings.nonStrikerId)}</div>
                        <div className="text-sm text-neutral-300 mt-2">
                            {nonStrikerStats.runs} ({nonStrikerStats.balls}) • {nonStrikerStats.fours}×4 • {nonStrikerStats.sixes}×6
                        </div>
                    </div>
                </div>

                {/* Bowler */}
                <div className="bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="text-sm font-semibold text-red-400 mb-2">BOWLER</div>
                    <div className="font-bold text-lg mb-4">{getPlayerName(currentInnings.currentBowlerId)}</div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Overs</span>
                            <span className="font-bold">{bowlerOversDisplay}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Wickets</span>
                            <span className="font-bold text-red-400">{bowlerStats.wickets}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Runs</span>
                            <span className="font-bold">{bowlerStats.runsConceded}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Economy</span>
                            <span className="font-bold">{economy}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Info for 2nd Innings */}
            {liveScore.currentInnings === 2 && (
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm font-semibold text-blue-400">TARGET</div>
                            <div className="text-xl font-bold">{liveScore.target}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-yellow-400">REQUIRED</div>
                            <div className="text-xl font-bold">
                                {liveScore.requiredRuns} runs • {liveScore.requiredRunRate.toFixed(2)} RPO
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentMatchState;