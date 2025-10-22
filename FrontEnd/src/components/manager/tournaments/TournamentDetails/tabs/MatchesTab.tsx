import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { useParams } from "react-router-dom";
import { Swords } from "lucide-react";
import EmptyState from "../shared/EmptyState";
import LoadingOverlay from "../../../../shared/LoadingOverlay";
import { getTournamentMatches } from "../../../../../features/manager/Tournaments/tournamentThunks";

export default function MatchesTab() {
    const dispatch = useAppDispatch();
    const { id } = useParams();

    const { matches, fixturesLoading } = useAppSelector(state => state.managerTournaments);

    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (id && !fetched) {
            dispatch(getTournamentMatches(id));
            setFetched(true);
        }
    }, [dispatch, id, fetched]);

    console.log(matches, "matches")


    if (fixturesLoading) return <LoadingOverlay show />;

    if (!matches || matches.length === 0) {
        return (
            <EmptyState
                icon={<Swords size={48} className="mx-auto mb-4 text-green-400" />}
                title="Live & Upcoming Matches"
                message="Matches schedule coming soon"
                subtitle="Matches will appear here once fixtures are generated"
            />
        );
    }

    return (
        <div className="space-y-4 p-4">
            <h2 className="text-lg font-semibold text-white mb-2">
                Live & Upcoming Matches
            </h2>

            <div className="space-y-3">
                {matches.map(match => (
                    <div
                        key={match._id}
                        className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10"
                    >
                        <div className="flex flex-col text-sm text-neutral-200">
                            <span className="font-medium text-white">
                                {match.teamA || match.teamA || "Team 1"} vs {match.teamB || match.teamB || "Team 2"}
                            </span>
                            <span className="text-xs text-neutral-400">
                                Status:{" "}
                                <span
                                    className={`${match.status === "completed"
                                        ? "text-green-400"
                                        : match.status === "upcoming"
                                            ? "text-yellow-400"
                                            : "text-blue-400"
                                        }`}
                                >
                                    {match.status}
                                </span>
                            </span>
                        </div>

                        <Swords className="text-green-400" size={24} />
                    </div>
                ))}
            </div>
        </div>
    );
}
