import React from 'react';
import { Target, CircleDot} from 'lucide-react';
import type { Match, LiveScoreState, Team } from '../../../features/manager/Matches/matchTypes';

interface CurrentMatchStateProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
}

const CurrentMatchState: React.FC<CurrentMatchStateProps> = ({ match, teamA, teamB, liveScore }) => {

    // --- Loading State (Themed) ---
    if (!liveScore) {
        return (
            <div className="w-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm p-6">
                <div className="animate-pulse space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="h-6 bg-muted rounded w-1/3"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                    <div className="h-24 bg-muted/50 rounded-xl w-full"></div>
                    <div className="h-12 bg-muted rounded w-full"></div>
                </div>
            </div>
        );
    }

    // --- Data Preparation ---
    const currentInnings = liveScore.currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;
    if (!currentInnings) return <div className="p-8 text-center bg-card border border-border rounded-xl text-muted-foreground italic">Waiting for innings data...</div>;

    const battingTeam = match.teamA._id === currentInnings.battingTeam ? match.teamA : match.teamB;
    const bowlingTeam = match.teamA._id === currentInnings.bowlingTeam ? match.teamA : match.teamB;

    const getPlayerName = (playerId: string | null): string => {
        if (!playerId) return '-';
        const player = [...teamA.members, ...teamB.members].find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const toArray = (data : any) => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") return Object.values(data);
        return [];
    };

    const battingStatsArray = toArray(currentInnings.battingStats);
    const bowlingStatsArray = toArray(currentInnings.bowlingStats);

    const strikerStats = battingStatsArray.find((s: any) => s.playerId === currentInnings.currentStriker) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
    const nonStrikerStats = battingStatsArray.find((s: any) => s.playerId === currentInnings.currentNonStriker) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
    const bowlerStats = bowlingStatsArray.find((s: any) => s.playerId === currentInnings.currentBowler) || { overs: 0, maidens: 0, wickets: 0, runsConceded: 0 };

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

    const StatPill = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
        <div className="flex flex-col items-center px-4 min-w-[60px]">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-destructive' : 'text-foreground'}`}>{value}</span>
        </div>
    );

    return (
        <div className="w-full mx-auto bg-card rounded-2xl border border-border shadow-sm overflow-hidden font-sans">

            {/* 1. Header & Toss Info */}
            <div className="bg-muted/30 px-5 py-3 border-b border-border flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                    <span className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded text-[10px] font-bold tracking-wider animate-pulse shadow-sm">LIVE</span>
                    <span className="font-medium">
                        {matchInfo ? (
                            <>
                                <span className="text-foreground font-bold">{matchInfo.tossWinner.name}</span> elected to {matchInfo.decision}
                            </>
                        ) : `Match #${match.matchNumber}`}
                    </span>
                </div>
                <div className="font-mono bg-background/50 px-2 py-0.5 rounded border border-border/50">
                    Innings {liveScore.currentInnings}
                </div>
            </div>

            {/* 2. Main Scoreboard */}
            <div className="relative p-6 md:p-8 bg-gradient-to-br from-card via-card to-muted/20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-2">
                    <div>
                        <div className="text-muted-foreground text-sm font-medium mb-2 flex items-center gap-2">
                            <span className="text-foreground font-bold text-lg">{battingTeam.name}</span> 
                            <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Batting</span>
                        </div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-6xl font-black tracking-tighter text-foreground tabular-nums drop-shadow-sm">
                                {currentInnings.runs}/{currentInnings.wickets}
                            </span>
                            <span className="text-xl text-muted-foreground font-light">
                                in <span className="text-foreground font-medium">{currentInnings.overs}</span> ov
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-muted/30 p-3 rounded-xl border border-border/50">
                        <div className="text-right">
                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">CRR</div>
                            <div className="text-xl font-bold text-primary">{currentInnings.currentRunRate}</div>
                        </div>
                        {liveScore.currentInnings === 2 && (
                            <div className="text-right border-l border-border pl-6">
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Req. RR</div>
                                <div className="text-xl font-bold text-orange-500">{liveScore.requiredRunRate.toFixed(2)}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Target Progress Bar (Only 2nd Innings) */}
                {liveScore.currentInnings === 2 && (
                    <div className="mt-6 pt-4 border-t border-border">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Target size={14} className="text-primary" /> 
                                Target: <span className="text-foreground font-bold">{liveScore.target}</span>
                            </span>
                            <span className="text-orange-500 font-medium bg-orange-500/10 px-2 py-0.5 rounded">
                                Need <span className="font-bold">{liveScore.requiredRuns}</span> runs off <span className="font-bold">{match.overs * 6 - currentInnings.overs * 6}</span> balls
                            </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min(((currentInnings.runs / liveScore.target) * 100), 100)}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. The Pitch: Players Table */}
            <div className="border-t border-border">
                {/* Headers */}
                <div className="grid grid-cols-[1fr_repeat(3,auto)] gap-4 px-6 py-2.5 bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
                    <div>Batter</div>
                    <div className="w-16 text-center">R (B)</div>
                    <div className="w-10 text-center">4s</div>
                    <div className="w-10 text-center">6s</div>
                </div>

                {/* Striker */}
                <div className="grid grid-cols-[1fr_repeat(3,auto)] gap-4 px-6 py-4 border-b border-border/50 items-center hover:bg-muted/30 transition-colors bg-primary/5 border-l-4 border-l-primary relative">
                    <div className="flex items-center gap-2.5">
                        <span className="font-bold text-foreground text-sm">{getPlayerName(currentInnings.currentStriker)}</span>
                        <CircleDot size={14} className="text-primary animate-pulse" fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <div className="w-16 text-center text-foreground font-bold text-sm">
                        {strikerStats.runs} <span className="text-muted-foreground font-normal text-xs">({strikerStats.balls})</span>
                    </div>
                    <div className="w-10 text-center text-xs text-muted-foreground">{strikerStats.fours}</div>
                    <div className="w-10 text-center text-xs text-muted-foreground">{strikerStats.sixes}</div>
                </div>

                {/* Non-Striker */}
                <div className="grid grid-cols-[1fr_repeat(3,auto)] gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors">
                    <div className="text-muted-foreground text-sm font-medium">{getPlayerName(currentInnings.currentNonStriker)}</div>
                    <div className="w-16 text-center text-muted-foreground font-medium text-sm">
                        {nonStrikerStats.runs} <span className="text-muted-foreground/60 font-normal text-xs">({nonStrikerStats.balls})</span>
                    </div>
                    <div className="w-10 text-center text-xs text-muted-foreground/60">{nonStrikerStats.fours}</div>
                    <div className="w-10 text-center text-xs text-muted-foreground/60">{nonStrikerStats.sixes}</div>
                </div>
            </div>

            {/* 4. Bowler Section */}
            <div className="bg-muted/10 border-t border-border">
                <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-5 items-center">
                    <div>
                        <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">Current Bowler</div>
                        <div className="text-sm font-bold text-foreground">{getPlayerName(currentInnings.currentBowler)}</div>
                    </div>
                    <div className="flex items-center divide-x divide-border bg-card rounded-lg border border-border py-1">
                        <StatPill label="Ov" value={bowlerOversDisplay} />
                        <StatPill label="Runs" value={bowlerStats.runsConceded} />
                        <StatPill label="Wkts" value={bowlerStats.wickets} highlight />
                        <StatPill label="Eco" value={economy} />
                    </div>
                </div>
            </div>

            {/* 5. Footer: Extras */}
            <div className="px-6 py-4 bg-muted/40 border-t border-border flex justify-between items-center text-xs text-muted-foreground font-medium">
                <div className="flex gap-4 items-center">
                    <span className="flex items-center gap-1.5 bg-card px-2 py-1 rounded border border-border">
                        Extras 
                        <span className="text-foreground font-bold ml-1">
                            {currentInnings.extras?.total ??
                                ((currentInnings.extras?.wides || 0) +
                                    (currentInnings.extras?.noBalls || 0) +
                                    (currentInnings.extras?.legByes || 0) +
                                    (currentInnings.extras?.byes || 0) +
                                    (currentInnings.extras?.penalty || 0))}
                        </span>
                    </span>

                    <div className="hidden sm:flex gap-3 text-[10px] uppercase tracking-wide">
                        <span>Wd: <b className="text-foreground">{currentInnings.extras?.wides || 0}</b></span>
                        <span>Nb: <b className="text-foreground">{currentInnings.extras?.noBalls || 0}</b></span>
                        <span>Lb: <b className="text-foreground">{currentInnings.extras?.legByes || 0}</b></span>
                        <span>B: <b className="text-foreground">{currentInnings.extras?.byes || 0}</b></span>
                        {currentInnings.extras?.penalty > 0 && (
                            <span className="text-destructive">Pen: <b>{currentInnings.extras.penalty}</b></span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/70">
                    <span className="uppercase text-[10px] tracking-wider font-bold">Bowling</span>
                    <span className="font-semibold text-foreground">{bowlingTeam.name}</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentMatchState;