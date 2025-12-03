import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Swords } from "lucide-react";
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
                        className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer"
                    >
                        {/* Teams */}
                        <div className="flex items-center gap-3">
                            {/* Team A */}
                            {match.teamLogoA && (
                                <img
                                    src={match.teamLogoA}
                                    alt={match.teamA}
                                    className="w-10 h-10 object-contain rounded-full border border-white/20"
                                />
                            )}
                            <span className="font-medium text-white">{match.teamA}</span>

                            <span className="mx-2 text-neutral-400 font-semibold">vs</span>

                            {/* Team B */}
                            {match.teamLogoB && (
                                <img
                                    src={match.teamLogoB}
                                    alt={match.teamB || 'bye'}
                                    className="w-10 h-10 object-contain rounded-full border border-white/20"
                                />
                            )}
                            <span className="font-medium text-white">{match.teamB}</span>
                        </div>


                        <div className="flex justify-center items-center gap-3">
                            <span
                                className={`${match.status === "completed"
                                    ? "text-green-400"
                                    : match.status === "upcoming"
                                        ? "text-yellow-400"
                                        : "text-blue-400"
                                    } text-sm font-medium`}
                            >
                                {match.status}
                            </span>

                            <Link
                                to={`/manager/match/${match._id}/dashboard`}
                                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white  text-sm font-semibold rounded-full  hover:bg-green-700 transition-colors duration-200  w-full md:w-auto justify-center"
                            >
                                Go to Dashboard
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}