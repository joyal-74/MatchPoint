import { useEffect, type JSX } from "react";
import { Zap, Skull, Trophy } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { fetchLeaderboard } from "../../../../../features/manager/Tournaments/tournamentThunks";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import type { RootState } from "../../../../../app/rootReducer";

const ACCENT_CLASSES = {
    orange: {
        border: "border-orange-500",
        bgHeader: "bg-gray-700/50",
        textIcon: "text-orange-400",
        textLg: "text-orange-400",
        textSm: "text-orange-300",
        bgFirst: "bg-orange-900/40",
    },
    purple: {
        border: "border-purple-500",
        bgHeader: "bg-gray-700/50",
        textIcon: "text-purple-400",
        textLg: "text-purple-400",
        textSm: "text-purple-300",
        bgFirst: "bg-purple-900/40",
    },
    yellow: {
        border: "border-yellow-500",
        bgHeader: "bg-gray-700/50",
        textIcon: "text-yellow-400",
        textLg: "text-yellow-400",
        textSm: "text-yellow-300",
        bgFirst: "bg-yellow-900/40",
    },
};

// Reusable Table Component
const LeaderboardTable = ({ title, data, valueLabel, icon, accentColor, }: {
    title: string; data: any[]; valueLabel: string; icon: JSX.Element; accentColor: "orange" | "purple" | "yellow";
}) => {
    const styles = ACCENT_CLASSES[accentColor];

    return (
        <div className="bg-neutral-800 rounded-xl shadow-2xl overflow-hidden h-full">
            <div
                className={`p-4 flex items-center space-x-2 border-b-4 ${styles.border} ${styles.bgHeader}`}
            >
                {icon}
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>

            <div className="grid grid-cols-10 gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-700">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Player</div>
                <div className="col-span-1 text-center">Team</div>
                <div className="col-span-2 text-right">{valueLabel}</div>
            </div>

            <div className="divide-y divide-gray-700">
                {data.map((player, idx) => (
                    <div
                        key={player.playerId}
                        className={`grid grid-cols-10 gap-2 py-3 px-4 items-center hover:bg-gray-700/80 transition-colors duration-150
                            ${idx + 1 === 1 ? styles.bgFirst : ""}
                        `}
                    >
                        <div className="col-span-1 font-bold">
                            <span
                                className={
                                    idx + 1 <= 3
                                        ? `${styles.textLg} text-lg`
                                        : "text-gray-300"
                                }
                            >
                                {idx + 1}
                            </span>
                        </div>

                        <div className="col-span-6 text-sm text-gray-100 font-medium truncate">
                            {player.name}
                        </div>

                        <div className="col-span-1 text-center text-xs text-gray-400 font-medium">
                            {player.teamName}
                        </div>

                        <div className="col-span-2 text-right font-extrabold">
                            <span className={styles.textSm}>
                                {valueLabel === "MVP Pts"
                                    ? player.value?.toFixed(1)
                                    : player.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Main Component
export default function LeaderBoardData() {
    const dispatch = useAppDispatch();
    const { leaderboard, loading } = useAppSelector((state: RootState) => state.managerTournaments);
    console.log(leaderboard, 'lllll')
    const { id } = useParams<{ id: string }>();

    useEffect(() => {

        if (id && (!leaderboard.tournamentId || leaderboard.tournamentId !== id)) {
            dispatch(fetchLeaderboard(id));
        }
    }, [id, dispatch, leaderboard.tournamentId]);

    if (loading)
        return (
            <LoadingOverlay show={loading} />
        );

    if (!leaderboard || leaderboard.topRuns.length === 0)
        return (
            <div className="p-8 text-center text-gray-400">
                <Trophy size={48} className="mx-auto mb-4" />
                <p className="text-xl font-semibold">No Leaderboard Data Available</p>
                <p>Please check if any matches have been completed for this tournament.</p>
            </div>
        );

    return (
        <div className="p-3 text-white sm:p-6 lg:p-5">
            <h1 className="text-2xl font-bold text-white mb-5 border-b border-gray-700 pb-4">
                Tournament Statistical Leaders
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <LeaderboardTable
                    title="Top Runs Scorer (Orange Cap)"
                    data={leaderboard.topRuns}
                    valueLabel="Runs"
                    icon={<Zap size={24} className="text-orange-400" />}
                    accentColor="orange"
                />

                <LeaderboardTable
                    title="Top Wicket Taker (Purple Cap)"
                    data={leaderboard.topWickets}
                    valueLabel="Wickets"
                    icon={<Skull size={24} className="text-purple-400" />}
                    accentColor="purple"
                />

                <LeaderboardTable
                    title="Most Valuable Player"
                    data={leaderboard.mvp}
                    valueLabel="MVP Pts"
                    icon={<Trophy size={24} className="text-yellow-400" />}
                    accentColor="yellow"
                />
            </div>
        </div>
    );
}