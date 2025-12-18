import TournamentCard from "./TournamentCard";
import type { Tournament } from "../../../features/manager/managerTypes";
import EmptyState from "./TournamentDetails/shared/EmptyState";
import { useNavigate } from "react-router-dom";

interface MyTournamentsSectionProps {
    tournaments: Tournament[];
    hasMore: boolean;
    onShowAll: () => void;
    onEdit: (tournament: Tournament) => void;
    onCancel: (id: string) => void;
    onCreate: () => void;
}

export default function MyTournamentsSection({ tournaments, hasMore, onShowAll, onEdit, onCancel, onCreate }: MyTournamentsSectionProps) {
    const navigate = useNavigate();
    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <span className="w-2 h-6 bg-green-500 rounded-full inline-block"></span>
                        My Active Tournaments
                    </h2>
                    <p className="text-neutral-400 text-sm">Tournaments you're currently managing</p>
                </div>
                {hasMore ? (
                    <button
                        className="text-green-400 hover:text-green-300 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border border-green-400/20 hover:border-green-400/40 bg-green-400/5 hover:bg-green-400/10"
                        onClick={onShowAll} >  View All →
                    </button>
                ) : (
                    <button
                        className="text-neutral-400 px-4 py-2 rounded-lg font-medium text-sm border border-neutral-600/20 bg-neutral-400/5 cursor-default"
                        disabled
                    >
                        All Tournaments
                    </button>
                )}
            </div>

            {tournaments.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {tournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                type="manage"
                                index={index}
                                onAction={() => navigate(`/manager/tournaments/${tournament._id}/manage`)}
                                onEdit={() => onEdit(tournament)}
                                onCancel={onCancel}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={onShowAll}
                                className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-colors font-medium"
                            >
                                Show All {tournaments.length} Tournaments
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <EmptyState
                    title="No tournaments found"
                    message=""
                    subtitle="You haven't created any tournaments yet"
                    buttonText="Create Your First Tournament"
                    onAction={onCreate}
                    titleSize="text-xl"
                    messageSize="text-base"
                    subtitleSize="text-sm"
                />
            )}
        </section>
    );
}