import React from 'react';
import { Target, CircleDot } from 'lucide-react';
import type { Match, LiveScoreState, Team } from '../../../features/manager/Matches/matchTypes';

interface CurrentMatchStateProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
}

const CurrentMatchState: React.FC<CurrentMatchStateProps> = ({ match, teamA, teamB, liveScore }) => {

    // --- Loading State ---
    if (!liveScore) {
        return (
            <div className="w-full bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl p-6">
                <div className="animate-pulse space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-neutral-900 rounded w-1/3"></div>
                        <div className="h-6 bg-neutral-900 rounded w-16"></div>
                    </div>
                    <div className="h-20 bg-neutral-900/50 rounded-xl w-full"></div>
                    <div className="h-12 bg-neutral-900 rounded w-full"></div>
                </div>
            </div>
        );
    }

    // console.log(liveScore)

    // --- Data Preparation ---
    const currentInnings = liveScore.currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;
    if (!currentInnings) return <div className="text-neutral-500 text-center italic p-6">Waiting for match data...</div>;

    const getBattingTeam = (): Team => match.teamA._id === currentInnings.battingTeamId ? match.teamA : match.teamB;
    const getBowlingTeam = (): Team => match.teamA._id === currentInnings.bowlingTeamId ? match.teamA : match.teamB;

    const battingTeam = getBattingTeam();
    const bowlingTeam = getBowlingTeam();

    const getPlayerName = (playerId: string | null): string => {
        if (!playerId) return '-';
        const player = [...teamA.members, ...teamB.members].find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const toArray = (data : unknown) => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") return Object.values(data);
        return [];
    };

    const battingStatsArray = toArray(currentInnings.battingStats);
    const bowlingStatsArray = toArray(currentInnings.bowlingStats);

    const strikerStats = battingStatsArray.find(s => s.playerId === currentInnings.currentStriker) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
    const nonStrikerStats = battingStatsArray.find(s => s.playerId === currentInnings.currentNonStriker) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
    const bowlerStats = bowlingStatsArray.find(s => s.playerId === currentInnings.currentBowler) || { overs: 0, maidens: 0, wickets: 0, runsConceded: 0 };

    const calculateOversDisplay = (overs: number): string => {
        const fullOvers = Math.floor(overs);
        const balls = Math.round((overs % 1) * 10);
        return `${fullOvers}.${balls}`;
    };

    const bowlerOversDisplay = calculateOversDisplay(bowlerStats.overs);
    const economy = bowlerStats.overs > 0 ? (bowlerStats.runsConceded / bowlerStats.overs).toFixed(2) : '0.00';

    const getMatchInfo = () => {
        if (!match.tossWinner || !match.tossDecision) return null;
        const tossWinner = match.tossWinner === match.teamA._id ? match.teamA : match.teamB;
        return { tossWinner, decision: match.tossDecision };
    };
    const matchInfo = getMatchInfo();

    const StatPill = ({ label, value, colorClass = "text-white" }: { label: string, value: string | number, colorClass?: string }) => (
        <div className="flex flex-col items-center px-3 min-w-[60px]">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{label}</span>
            <span className={`text-sm font-bold  ${colorClass}`}>{value}</span>
        </div>
    );

    return (
        <div className="w-full mx-auto bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden font-sans">

            {/* 1. Header & Toss Info */}
            <div className="bg-neutral-900/50 px-4 py-2 border-b border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider animate-pulse">LIVE</span>
                    <span>{matchInfo ? `${matchInfo.tossWinner.name} chose to ${matchInfo.decision}` : `Match #${match.matchNumber}`}</span>
                </div>
                <div>
                    Innings {liveScore.currentInnings}
                </div>
            </div>

            {/* 2. Main Scoreboard */}
            <div className="relative p-8 bg-gradient-to-br from-neutral-900 to-neutral-950">
                <div className="flex justify-between items-end mb-1">
                    <div>
                        <div className="text-neutral-400 text-md font-medium mb-1 flex items-center gap-1.5">
                            {battingTeam.name} <span className="w-1 h-1 rounded-full bg-neutral-600"></span> Batting
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-bold tracking-tighter text-white tabular-nums">
                                {currentInnings.runs}/{currentInnings.wickets}
                            </span>
                            <span className="text-xl text-neutral-400 font-light">
                                in {currentInnings.overs} ov
                            </span>
                        </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-xs text-neutral-500 uppercase">CRR</div>
                            <div className="text-lg font-bold text-blue-400">{currentInnings.currentRunRate}</div>
                        </div>
                        {liveScore.currentInnings === 2 && (
                            <div className="text-right border-l border-neutral-800 pl-3">
                                <div className="text-xs text-neutral-500 uppercase">Req</div>
                                <div className="text-lg  font-bold text-yellow-500">{liveScore.requiredRunRate.toFixed(2)}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Target Progress Bar (Only 2nd Innings) */}
                {liveScore.currentInnings === 2 && (
                    <div className="mt-4 pt-4 border-t border-neutral-800/50">
                        <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                            <span className="flex items-center gap-1"><Target size={12} /> Target: {liveScore.target}</span>
                            <span className="text-yellow-500 font-medium">Need {liveScore.requiredRuns} off {match.overs * 6 - currentInnings.overs * 6} balls</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                style={{ width: `${Math.min(((currentInnings.runs / liveScore.target) * 100), 100)}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. The Pitch: Players Table */}
            <div className="border-t border-neutral-800">
                {/* Headers */}
                <div className="grid grid-cols-[1fr_repeat(3,auto)] gap-4 px-6 py-2 bg-neutral-900/30 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                    <div>Batter</div>
                    <div className="w-12 text-center">R (B)</div>
                    <div className="w-8 text-center">4s</div>
                    <div className="w-8 text-center">6s</div>
                </div>

                {/* Striker */}
                <div className="grid grid-cols-[1fr_repeat(3,auto)] gap-4 px-6 py-4 border-b border-neutral-800/50 items-center hover:bg-neutral-900/20 transition-colors bg-blue-900/5 border-l-2 border-l-blue-500">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-md">{getPlayerName(currentInnings.currentStriker)}</span>
                        <CircleDot size={12} className="text-blue-500 animate-pulse" fill="currentColor" />
                    </div>
                    <div className="w-15 text-center  text-white font-bold">
                        {strikerStats.runs} <span className="text-neutral-500 font-normal">({strikerStats.balls})</span>
                    </div>
                    <div className="w-8 text-center text-sm text-neutral-400">{strikerStats.fours}</div>
                    <div className="w-8 text-center text-sm text-neutral-400">{strikerStats.sixes}</div>
                </div>

                {/* Non-Striker */}
                <div className="grid grid-cols-[1fr_repeat(3,auto)] gap-4 px-6 py-4 items-center hover:bg-neutral-900/20 transition-colors">
                    <div className="text-neutral-300 text-md">{getPlayerName(currentInnings.currentNonStriker)}</div>
                    <div className="w-15 text-center  text-neutral-300">
                        {nonStrikerStats.runs} <span className="text-neutral-500 font-normal">({nonStrikerStats.balls})</span>
                    </div>
                    <div className="w-8 text-center text-sm text-neutral-500">{nonStrikerStats.fours}</div>
                    <div className="w-8 text-center text-sm text-neutral-500">{nonStrikerStats.sixes}</div>
                </div>
            </div>

            {/* 4. Bowler Section */}
            <div className="bg-neutral-900/30 border-t border-neutral-800">
                <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-5 items-center">
                    <div>
                        <div className="text-[10px] uppercase text-neutral-500 font-semibold mb-0.5">Current Bowler</div>
                        <div className="text-md font-bold text-white">{getPlayerName(currentInnings.currentBowler)}</div>
                    </div>
                    <div className="flex items-center divide-x divide-neutral-800">
                        <StatPill label="Ov" value={bowlerOversDisplay} />
                        <StatPill label="Runs" value={bowlerStats.runsConceded} />
                        <StatPill label="Wkts" value={bowlerStats.wickets} colorClass="text-red-400" />
                        <StatPill label="Eco" value={economy} colorClass="text-neutral-400" />
                    </div>
                </div>
            </div>

            {/* 5. Footer: Extras */}
            <div className="px-6 py-5 bg-neutral-950 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                <div className="flex gap-4 text-sm items-center">
                    <span>
                        Extras:{" "}
                        <strong className="text-white">
                            {currentInnings.extras?.total ??
                                ((currentInnings.extras?.wides || 0) +
                                    (currentInnings.extras?.noBalls || 0) +
                                    (currentInnings.extras?.legByes || 0) +
                                    (currentInnings.extras?.byes || 0) +
                                    (currentInnings.extras?.penalty || 0))}
                        </strong>
                    </span>

                    <span className="text-neutral-600">|</span>

                    <span>Wd: {currentInnings.extras?.wides || 0}</span>
                    <span>Nb: {currentInnings.extras?.noBalls || 0}</span>
                    <span>Lb: {currentInnings.extras?.legByes || 0}</span>
                    <span>B: {currentInnings.extras?.byes || 0}</span>
                    {currentInnings.extras?.penalty > 0 && (
                        <span>P: {currentInnings.extras.penalty}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-neutral-500">
                    <span className="uppercase text-[10px] tracking-wider font-semibold">{bowlingTeam.name}</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentMatchState;