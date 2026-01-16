import { useEffect, type JSX } from "react";
import { Zap, Skull, Trophy, Medal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { fetchLeaderboard } from "../../../../../features/manager/Tournaments/tournamentThunks";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import type { RootState } from "../../../../../app/store";


const ACCENT_STYLES = {
    orange: {
        border: "border-orange-500",
        icon: "text-orange-600 dark:text-orange-400",
        textValue: "text-orange-700 dark:text-orange-400",
        highlightRow: "bg-orange-500/10 dark:bg-orange-500/20",
    },
    purple: {
        border: "border-purple-500",
        icon: "text-purple-600 dark:text-purple-400",
        textValue: "text-purple-700 dark:text-purple-400",
        highlightRow: "bg-purple-500/10 dark:bg-purple-500/20",
    },
    yellow: {
        border: "border-yellow-500",
        icon: "text-yellow-600 dark:text-yellow-400",
        textValue: "text-yellow-700 dark:text-yellow-400",
        highlightRow: "bg-yellow-500/10 dark:bg-yellow-500/20",
    },
};

// Reusable Table Component
const LeaderboardTable = ({ 
    title, 
    data, 
    valueLabel, 
    icon, 
    accentColor, 
}: {
    title: string; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]; 
    valueLabel: string; 
    icon: JSX.Element; 
    accentColor: "orange" | "purple" | "yellow";
}) => {
    const styles = ACCENT_STYLES[accentColor];

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className={`p-4 flex items-center space-x-3 border-b-4 ${styles.border} bg-muted/30`}>
                <div className={`${styles.icon}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-10 gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-card">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Player</div>
                <div className="col-span-1 text-center">Team</div>
                <div className="col-span-2 text-right">{valueLabel}</div>
            </div>

            {/* List */}
            <div className="divide-y divide-border flex-1">
                {data.map((player, idx) => (
                    <div
                        key={player.playerId || idx}
                        className={`grid grid-cols-10 gap-2 py-3 px-4 items-center transition-colors duration-150
                            ${idx === 0 ? styles.highlightRow : "hover:bg-muted/50"}
                        `}
                    >
                        {/* Rank */}
                        <div className="col-span-1 font-bold flex items-center">
                            {idx === 0 ? (
                                <Medal size={16} className={styles.icon} />
                            ) : (
                                <span className={`text-sm ${idx < 3 ? "text-foreground font-extrabold" : "text-muted-foreground"}`}>
                                    {idx + 1}
                                </span>
                            )}
                        </div>

                        {/* Player Name */}
                        <div className="col-span-6 text-sm text-foreground font-medium truncate">
                            {player.name}
                        </div>

                        {/* Team Code */}
                        <div className="col-span-1 text-center text-xs text-muted-foreground font-medium">
                            {player.teamName ? player.teamName.substring(0, 3).toUpperCase() : '-'}
                        </div>

                        {/* Value */}
                        <div className="col-span-2 text-right font-extrabold">
                            <span className={`text-sm ${styles.textValue}`}>
                                {valueLabel === "MVP Pts"
                                    ? Number(player.value).toFixed(1)
                                    : player.value}
                            </span>
                        </div>
                    </div>
                ))}
                
                {data.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No data recorded yet
                    </div>
                )}
            </div>
        </div>
    );
};


// Main Component
export default function LeaderBoardData() {
    const dispatch = useAppDispatch();
    const { leaderboard, loading } = useAppSelector((state: RootState) => state.managerTournaments);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id && (!leaderboard.tournamentId || leaderboard.tournamentId !== id)) {
            dispatch(fetchLeaderboard(id));
        }
    }, [id, dispatch, leaderboard.tournamentId]);

    if (loading)
        return (
            <div className="min-h-[400px] relative">
                <LoadingOverlay show={loading} />
            </div>
        );

    // Empty State
    if (!leaderboard || (!leaderboard.topRuns?.length && !leaderboard.topWickets?.length))
        return (
            <div className="p-12 text-center bg-card border border-border border-dashed rounded-xl mx-4 my-6">
                <Trophy size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-xl font-semibold text-foreground">No Leaderboard Data Available</p>
                <p className="text-muted-foreground mt-2">Stats will appear here once matches are completed.</p>
            </div>
        );

    return (
        <div className="p-3 sm:p-6 lg:p-5">
            <h1 className="text-2xl font-bold text-foreground mb-6 pb-4 border-b border-border">
                Tournament Statistical Leaders
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orange Cap - Batting */}
                <LeaderboardTable
                    title="Top Runs (Orange Cap)"
                    data={leaderboard.topRuns || []}
                    valueLabel="Runs"
                    icon={<Zap size={20} />}
                    accentColor="orange"
                />

                {/* Purple Cap - Bowling */}
                <LeaderboardTable
                    title="Top Wickets (Purple Cap)"
                    data={leaderboard.topWickets || []}
                    valueLabel="Wickets"
                    icon={<Skull size={20} />}
                    accentColor="purple"
                />

                {/* MVP - All Rounder */}
                <LeaderboardTable
                    title="Most Valuable Player"
                    data={leaderboard.mvp || []}
                    valueLabel="MVP Pts"
                    icon={<Trophy size={20} />}
                    accentColor="yellow"
                />
            </div>
        </div>
    );
}