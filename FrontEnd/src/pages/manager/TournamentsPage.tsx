import { useEffect, useState } from "react";
import TournamentCard from "../../components/manager/tournaments/TournamentCard";
import TournamentFilter, { type FilterStatus } from "../../components/manager/tournaments/TournamentFilter";
import Navbar from "../../components/manager/Navbar";
import CreateTournamentModal from "../../components/manager/tournaments/TournamentModal/CreateTournamentModal";
import SecondaryButton from "../../components/ui/SecondaryButton";
import ManagementHeader from "../../components/manager/teams/TeamsHeader";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import type { RootState } from "../../app/store";
import { getExploreTournaments, getMyTournaments } from "../../features/manager/Tournaments/tournamentThunks";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { length } from "../../components/manager/teams/TeamCard/teamColors";
import EditTournamentModal from "../../components/manager/tournaments/TournamentModal/EditTournamentModal";
import type { Tournament } from "../../features/manager/managerTypes";


export default function TournamentsPage() {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    const dispatch = useAppDispatch();

    const { myTournaments, exploreTournaments, loading } = useAppSelector((state: RootState) => state.managerTournaments);
    const managerId = useAppSelector((state) => state.auth.user?._id);

    useEffect(() => {
        if (managerId) {
            dispatch(getMyTournaments(managerId));
            dispatch(getExploreTournaments(managerId));
        }
    }, [dispatch, managerId]);

    return (
        <>
            <LoadingOverlay show={loading} />
            <Navbar />

            <div className="min-h-screen bg-neutral-900 text-white p-8 mt-12 mx-10">

                <ManagementHeader buttontitle="Create Tournament +" title="Manage & Explore Tournaments" onCreateClick={() => setIsModalOpen(true)} />

                {/* My Tournaments Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">My Tournaments</h2>
                            <p className="text-neutral-400 text-sm">Tournaments you're currently managing</p>
                        </div>
                        <button className="text-green-400 hover:text-green-300 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border border-green-400/20 hover:border-green-400/40 bg-green-400/5 hover:bg-green-400/10">
                            View All →
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {myTournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                type="manage"
                                index={index}
                                onEdit={() => {
                                    setEditingTournament(tournament);
                                    setIsEditModalOpen(true);
                                }}
                            />
                        ))}

                    </div>
                </section>

                {/* Explore Tournaments Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Explore Tournaments</h2>
                            <p className="text-neutral-400 text-sm">Discover and join exciting tournaments</p>
                        </div>
                        <SecondaryButton children={"View All →"} />
                    </div>

                    <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative max-w-md flex-1">
                            <input
                                type="text"
                                placeholder="Search tournaments by name, sport, or location..."
                                className="w-full text-sm bg-neutral-800/50 border border-neutral-700/50 rounded-xl px-4 py-2 pl-12 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                            />
                            <svg
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* filter */}
                        <TournamentFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {exploreTournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament._id}
                                tournament={tournament}
                                type="explore"
                                index={length - index}
                            />
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-700/30 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-green-400 mb-2">50+</div>
                        <div className="text-neutral-400">Active Tournaments</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-700/30 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-blue-400 mb-2">1,200+</div>
                        <div className="text-neutral-400">Teams Participating</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-700/30 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-purple-400 mb-2">15+</div>
                        <div className="text-neutral-400">Sports Categories</div>
                    </div>
                </div>

                <CreateTournamentModal
                    isOpen={isModalOpen}
                    managerId={managerId!}
                    onClose={() => setIsModalOpen(false)}
                />
                {editingTournament && (
                    <EditTournamentModal
                        isOpen={isEditModalOpen}
                        managerId={managerId!}
                        tournament={editingTournament}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                )}


            </div>
        </>
    );
}