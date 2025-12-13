import { useMemo } from "react";
import { FaBaseballBall, FaFire } from "react-icons/fa";
import type { BallEvent, LiveScoreState, Match, Team } from "../../../features/manager/Matches/matchTypes";

interface LiveStatusBannerProps {
    match: Match | null;
    teamA: Team | null;
    teamB: Team | null;
    liveScore: LiveScoreState | null;
    getPlayerName: (id: string) => string;
}

function LiveStatusBanner({ teamA, teamB, liveScore, getPlayerName }: LiveStatusBannerProps) {

    const currentInnings = (liveScore?.currentInnings ?? 1) as 1 | 2;

    const currentBattingTeamId = useMemo(() => {
        if (!liveScore) return null;
        return currentInnings === 1
            ? liveScore.innings1?.battingTeamId || null
            : liveScore.innings2?.battingTeamId || null;
    }, [liveScore, currentInnings]);

    const statusMessage = useMemo(() => {
        if (!liveScore || !teamA || !teamB) return null;

        const battingTeam =
            currentBattingTeamId === teamA._id ? teamA : teamB;

        const inningsData =
            currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;

        // Win condition
        if (typeof liveScore.requiredRuns === "number" && liveScore.requiredRuns <= 0) {
            return `${battingTeam?.name || "Team"} wins!`;
        }

        // First innings — election message
        if (currentInnings === 1) {
            return `${battingTeam?.name || "Team"} elected to bat`;
        }

        // Second innings logic
        const runsNeeded = liveScore.requiredRuns;
        const ballsRemaining =
            typeof inningsData?.legalBalls === "number"
                ? inningsData.legalBalls
                : null;

        if (runsNeeded == null)
            return `${battingTeam?.name} batting`;

        if (ballsRemaining !== null)
            return `${battingTeam?.name} need ${runsNeeded} runs in ${ballsRemaining} balls`;

        const rrr =
            typeof liveScore.requiredRunRate === "number"
                ? ` (RRR ${liveScore.requiredRunRate.toFixed(2)})`
                : "";

        return `${battingTeam?.name} need ${runsNeeded} runs${rrr}`;
    }, [liveScore, teamA, teamB, currentBattingTeamId, currentInnings]);

    // Helper to style recent logs
    const getLogStyle = (log : BallEvent) => {
        const display = `${log.runs}${log.extra ? `(${log.extra})` : ""}`;
        const runsNum = typeof log.runs === 'number' ? log.runs : parseInt(log.runs, 10);

        if (display.includes('W')) {
            return 'bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold';
        }
        if (runsNum === 6) {
            return 'bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold';
        }
        if (runsNum === 4) {
            return 'bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold';
        }
        if (runsNum > 0 && runsNum < 4) {
            return 'bg-green-500 text-white px-2 py-1 rounded-full text-xs';
        }
        return 'bg-gray-600 text-white px-2 py-1 rounded-full text-xs';
    };

    // LOADING UI
    if (!liveScore || !teamA || !teamB) {
        return (
            <div className="max-w-7xl mx-auto px-4 mt-6 relative z-10">
                <div className="bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl p-6 h-48 animate-pulse flex items-center justify-center">
                    <span className="text-neutral-500">Loading Live Score...</span>
                </div>
            </div>
        );
    }

    // Determine left/right teams
    const firstBattingTeamId = liveScore.innings1?.battingTeamId || null;
    const leftTeam = firstBattingTeamId === teamA._id ? teamA : teamB;
    const rightTeam = leftTeam === teamA ? teamB : teamA;

    const leftInnings = liveScore.innings1;
    const rightInnings = liveScore.innings2 || null;

    const formatOvers = (balls: number | null | undefined) => {
        if (!balls && balls !== 0) return "0";
        const overs = Math.floor(balls / 6);
        const rem = balls % 6;
        return rem > 0 ? `${overs}.${rem}` : `${overs}`;
    };

    const currentInningsData =
        currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;

    const bowlerName = currentInningsData?.currentBowler
        ? getPlayerName(currentInningsData.currentBowler)
        : "-";

    const isLeftActive = currentBattingTeamId === leftTeam._id;

    const recentLogs = Array.isArray(currentInningsData?.recentLogs)
        ? currentInningsData.recentLogs.slice(-6)
        : [];

    return (
        <div className="max-w-7xl mx-auto px-4 mt-6 relative z-10">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                    {/* LEFT */}
                    <div className={`text-center transition-opacity duration-300 ${isLeftActive ? "opacity-100 scale-105" : "opacity-60"}`}>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-600 bg-neutral-900 flex items-center justify-center">
                                {leftTeam?.logo ? (
                                    <img src={leftTeam.logo} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold">L</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white">{leftTeam?.name}</h3>
                        </div>

                        <div className="text-4xl font-bold text-white">
                            {leftInnings?.runs ?? 0}/{leftInnings?.wickets ?? 0}
                        </div>
                        <div className="text-neutral-400">{formatOvers(leftInnings?.legalBalls)} ov</div>
                    </div>

                    {/* CENTER */}
                    <div className="text-center border-x border-neutral-700 px-4">
                        <div className="text-green-400 font-bold text-lg mb-1">
                            {statusMessage}
                        </div>

                        {currentInnings === 2 && (
                            <div className="text-sm text-neutral-400 mb-4">
                                Target: {liveScore.target ?? "-"}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-neutral-900/50 p-2 rounded">
                                <div className="text-neutral-500">CRR</div>
                                <div className="text-white font-bold">
                                    {(currentInningsData?.currentRunRate ?? liveScore.currentRunRate ?? 0).toString()}
                                </div>
                            </div>

                            <div className="bg-neutral-900/50 p-2 rounded">
                                <div className="text-neutral-500">RRR</div>
                                <div className={`${liveScore.requiredRunRate ? "text-red-400" : "text-neutral-600"} font-bold`}>
                                    {typeof liveScore.requiredRunRate === "number"
                                        ? liveScore.requiredRunRate.toFixed(2)
                                        : "-"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className={`text-center transition-opacity duration-300 ${!isLeftActive ? "opacity-100 scale-105" : "opacity-60"}`}>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-600 bg-neutral-900 flex items-center justify-center">
                                {rightTeam?.logo ? (
                                    <img src={rightTeam.logo} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold">R</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white">{rightTeam?.name}</h3>
                        </div>

                        <div className="text-4xl font-bold text-white">
                            {rightInnings?.runs ?? 0}/{rightInnings?.wickets ?? 0}
                        </div>
                        <div className="text-neutral-400">{formatOvers(rightInnings?.legalBalls)} ov</div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-6 pt-4 border-t border-neutral-700 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-neutral-300">
                        <FaFire className="text-orange-500" />
                        <span className="flex items-center gap-1 flex-wrap">
                            Last 6:{" "}
                            {recentLogs.length > 0 ? (
                                recentLogs.map((log, index: number) => {
                                    const display = `${log.runs}${log.extra ? `(${log.extra})` : ""}`;
                                    return (
                                        <span
                                            key={index}
                                            className={getLogStyle(log)}
                                        >
                                            {display}
                                        </span>
                                    );
                                })
                            ) : (
                                "-"
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-300">
                        <FaBaseballBall className="text-blue-400" />
                        <span>Bowler: {bowlerName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveStatusBanner;