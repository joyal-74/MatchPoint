import { useMemo } from "react";
import { Activity, Target, Disc } from "lucide-react";
import type { BallEvent, LiveScoreState, Match, Team } from "../../../../features/manager/Matches/matchTypes";


interface LiveStatusBannerProps {
    match: Match | null;
    teamA: Team | null;
    teamB: Team | null;
    liveScore: LiveScoreState | null;
    getPlayerName: (id: string) => string;
}

function LiveStatusBanner({ teamA, teamB, liveScore, getPlayerName }: LiveStatusBannerProps) {

    // --- LOGIC EXTRACTION ---
    const currentInnings = (liveScore?.currentInnings ?? 1) as 1 | 2;

    const currentBattingTeamId = useMemo(() => {
        if (!liveScore) return null;
        return currentInnings === 1
            ? liveScore.innings1?.battingTeam || null
            : liveScore.innings2?.battingTeam || null;
    }, [liveScore, currentInnings]);

    // Narrative Status Message
    const statusMessage = useMemo(() => {
        if (!liveScore || !teamA || !teamB) return "Loading match status...";

        const battingTeam = currentBattingTeamId === teamA._id ? teamA : teamB;
        const inningsData = currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;

        // Win condition
        if (typeof liveScore.requiredRuns === "number" && liveScore.requiredRuns <= 0) {
            return `${battingTeam?.name || "Batting Team"} wins!`;
        }
        // First innings
        if (currentInnings === 1) {
            return `${battingTeam?.name || "Batting Team"} elected to bat`;
        }
        // Second innings (Chasing)
        const runsNeeded = liveScore.requiredRuns;
        const ballsRemaining = typeof inningsData?.legalBalls === "number" ? inningsData.legalBalls : null;

        if (runsNeeded == null) return `${battingTeam?.name} batting`;
        if (ballsRemaining !== null) return `${battingTeam?.name} need ${runsNeeded} runs in ${ballsRemaining} balls`;

        return `${battingTeam?.name} need ${runsNeeded} runs`;
    }, [liveScore, teamA, teamB, currentBattingTeamId, currentInnings]);

    // Recent Logs Styling
    const getLogStyle = (log: BallEvent) => {
        const display = `${log.runs}${log.extra ? `(${log.extra})` : ""}`;
        const runsNum = typeof log.runs === 'number' ? log.runs : parseInt(log.runs as unknown as string, 10);

        // Wicket
        if (display.includes('W')) return 'bg-red-500/10 text-red-600 border-red-500/20 shadow-sm';
        // Boundaries
        if (runsNum === 6) return 'bg-purple-500/10 text-purple-600 border-purple-500/20 shadow-sm';
        if (runsNum === 4) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        // Dots/Singles
        if (runsNum === 0) return 'bg-muted text-muted-foreground border-border';
        return 'bg-card text-foreground border-border';
    };

    // --- RENDER PREP ---
    if (!liveScore || !teamA || !teamB) {
        return (
            <div className="max-w-7xl mx-auto px-4 mt-6">
                <div className="h-32 bg-muted/30 rounded-xl border border-border animate-pulse" />
            </div>
        );
    }

    const currentInningsData = currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;
    const battingTeamName = currentBattingTeamId === teamA._id ? teamA.name : teamB.name;

    // Overs Formatter
    const formatOvers = (balls: number | null | undefined) => {
        if (!balls && balls !== 0) return "0.0";
        const overs = Math.floor(balls / 6);
        const rem = balls % 6;
        return `${overs}.${rem}`;
    };

    const bowlerName = currentInningsData?.currentBowler ? getPlayerName(currentInningsData.currentBowler) : "Unknown Bowler";
    const recentLogs = Array.isArray(currentInningsData?.recentLogs) ? currentInningsData.recentLogs.slice(-6) : [];

    return (
        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">

                {/* 1. Status Bar (Hero) */}
                <div className="bg-muted/30 px-6 py-3 border-b border-border flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Activity size={16} className="text-emerald-500" />
                        <span className="uppercase tracking-wider text-xs text-muted-foreground font-bold">Status</span>
                        <span>{statusMessage}</span>
                    </div>
                    {currentInnings === 2 && (
                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            <Target size={14} className="text-primary" />
                            Target: <span className="text-foreground font-bold">{liveScore.target ?? "-"}</span>
                        </div>
                    )}
                </div>

                {/* 2. Main Metrics Grid */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">

                    {/* LEFT: Current Score (Big) */}
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">{battingTeamName}</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl md:text-6xl font-black text-foreground tracking-tighter tabular-nums leading-none">
                                    {currentInningsData?.runs ?? 0}/{currentInningsData?.wickets ?? 0}
                                </span>
                                <span className="text-xl md:text-2xl text-muted-foreground font-medium">
                                    {formatOvers(currentInningsData?.legalBalls)} <span className="text-base">ov</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CENTER: Run Rates (Divider on Desktop) */}
                    <div className="flex items-center gap-8 lg:border-x lg:border-border/50 lg:px-10 justify-start lg:justify-center">
                        {/* CRR */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">CRR</span>
                            <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {currentInningsData?.currentRunRate ?? liveScore.currentRunRate ?? "0.00"}
                            </span>
                        </div>

                        {/* RRR (If Chasing) */}
                        {currentInnings === 2 && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">RRR</span>
                                <span className={`text-xl font-mono font-bold ${liveScore.requiredRunRate && liveScore.requiredRunRate > 10 ? 'text-destructive' : 'text-primary'}`}>
                                    {typeof liveScore.requiredRunRate === "number" ? liveScore.requiredRunRate.toFixed(2) : "-"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Timeline & Bowler */}
                    <div className="flex flex-col gap-4">
                        {/* Recent Balls Timeline */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                <span>Last 6 Balls</span>
                                <span className="flex items-center gap-1 normal-case text-foreground font-medium">
                                    <Disc size={12} className="text-primary" />
                                    {bowlerName}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log, index) => {
                                        const display = `${log.runs}${log.extra ? ` ${log.extra}` : ""}`;
                                        return (
                                            <div
                                                key={index}
                                                className={`
                                                    w-9 h-9 flex items-center justify-center rounded-full border text-xs font-bold font-mono transition-transform hover:scale-110 cursor-default
                                                    ${getLogStyle(log)}
                                                `}
                                            >
                                                {display}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-xs text-muted-foreground italic">Waiting for first ball...</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LiveStatusBanner;