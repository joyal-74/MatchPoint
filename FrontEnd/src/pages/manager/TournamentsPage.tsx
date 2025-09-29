import { useState } from "react";
import TournamentCard from "../../components/manager/tournaments/TournamentCard1";
import TournamentFilter, { type FilterStatus } from "../../components/manager/tournaments/TournamentFilter";
import Navbar from "../../components/shared/Navbar";
import CreateTournamentModal from "../../components/manager/tournaments/CreateTournamentModal";


export default function TournamentsPage() {

    const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-900 text-white p-8 mt-12 mx-10">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-neutral-800/50 to-neutral-900/30 border border-neutral-700/50">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Create & Manage Tournaments</h1>
                        <p className="text-neutral-400">Organize your events and track ongoing tournaments</p>
                    </div>
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={() => setIsModalOpen(true)}>
                        Create Tournament +
                    </button>
                </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TournamentCard
                            title="All Kerala Cricket League cup"
                            date="15 January 2025"
                            venue="Sports complex"
                            teams="14/16 Teams"
                            fee="₹1000"
                            status="Ongoing"
                            type="manage"
                            color="bg-green-700"
                        />
                        <TournamentCard
                            title="All Kerala Cricket League cup"
                            date="15 January 2025"
                            venue="Sports complex"
                            teams="14/16 Teams"
                            fee="₹1000"
                            status="Ongoing"
                            type="manage"
                            color="bg-red-700"
                        />
                        <TournamentCard
                            title="All Kerala Cricket League cup"
                            date="15 January 2025"
                            venue="Sports complex"
                            teams="14/16 Teams"
                            fee="₹1000"
                            status="Ongoing"
                            type="manage"
                            color="bg-purple-700"
                        />
                    </div>
                </section>

                {/* Explore Tournaments Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Explore Tournaments</h2>
                            <p className="text-neutral-400 text-sm">Discover and join exciting tournaments</p>
                        </div>
                        <button className="text-green-400 hover:text-green-300 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border border-green-400/20 hover:border-green-400/40 bg-green-400/5 hover:bg-green-400/10">
                            View All →
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 flex justify-between">
                        <div className="relative max-w-md">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TournamentCard
                            title="All Kerala Cricket League cup"
                            date="15 January 2025"
                            venue="Sports complex"
                            teams="14/16 Teams"
                            fee="₹1000"
                            status="Completed"
                            type="explore"
                            color="bg-orange-700"
                        />
                        <TournamentCard
                            title="All Kerala Cricket League cup"
                            date="15 January 2025"
                            venue="Sports complex"
                            teams="14/16 Teams"
                            fee="₹1000"
                            status="Ongoing"
                            type="explore"
                            color="bg-pink-700"
                        />
                        <TournamentCard
                            title="All Kerala Cricket League cup"
                            date="15 January 2025"
                            venue="Sports complex"
                            teams="14/16 Teams"
                            fee="₹1000"
                            status="Ongoing"
                            type="explore"
                            color="bg-amber-700"
                        />
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
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </>
    );
}