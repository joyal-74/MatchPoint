import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Trophy, Clock, Award } from 'lucide-react';
import Navbar from '../../components/player/Navbar';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { Tournament } from '../../features/manager/managerTypes';
import { fetchTournaments } from '../../features/player/Tournnaments/tournamentThunks';

type TournamentTab = 'upcoming' | 'ongoing' | 'completed' | 'registered';

const TournamentsPage = () => {
    const [activeTab, setActiveTab] = useState<TournamentTab>('upcoming');
    const dispatch = useAppDispatch();

    const { allTournaments, loading } = useAppSelector((state) => state.playerTournaments);
    const playerId = useAppSelector(state => state.auth.user?._id)

    useEffect(() => {
        if (activeTab === 'registered' && playerId) {
            dispatch(fetchTournaments({ status: activeTab, playerId : playerId }));
        } else {
            dispatch(fetchTournaments({ status: activeTab }));
        }
    }, [activeTab, dispatch, playerId]);

    return (
        <>
            <Navbar />

            <div className="min-h-screen mt-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
                <div className="container mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-3">
                        <p className="text-5xl font-bold text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                            Discover tournaments.
                        </p>
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                            Discover and register for exciting tournaments. Compete and showcase your skills.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex overflow-x-auto space-x-1 mb-8 bg-white dark:bg-neutral-800 rounded-xl p-1 shadow-sm">
                        {[
                            { id: 'upcoming', label: 'Upcoming', icon: Clock },
                            { id: 'ongoing', label: 'Ongoing', icon: Trophy },
                            { id: 'completed', label: 'Completed', icon: Award },
                            { id: 'registered', label: 'My Tournaments', icon: Users },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id as TournamentTab)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === id
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Loader */}
                    {loading && (
                        <div className="text-center text-neutral-500 py-10">Loading tournaments...</div>
                    )}

                    {/* Grid */}
                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {allTournaments?.map((tournament: Tournament) => (
                                <TournamentCard key={tournament._id} tournament={tournament} type={activeTab} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && (!allTournaments || allTournaments.length === 0) && (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                                No tournaments found
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

interface TournamentCardProps {
    tournament: Tournament;
    type: TournamentTab;
}

const TournamentCard = ({ tournament, type }: TournamentCardProps) => {
    const start = new Date(tournament.startDate);
    const end = new Date(tournament.endDate);

    let status = 'Upcoming';
    let style = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';

    if (type === 'ongoing') {
        status = 'Live';
        style = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    } else if (type === 'completed') {
        status = 'Completed';
        style = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${style}`}>{status}</span>
            </div>

            <h3 className="font-bold text-lg mb-3 text-neutral-800 dark:text-neutral-200 line-clamp-2">
                {tournament.title}
            </h3>

            <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <Calendar className="w-4 h-4" />
                    <span>{start.toLocaleDateString()} - {end.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <Users className="w-4 h-4" />
                    <span>{tournament.teams?.length || 0} Teams</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{tournament.location}</span>
                </div>
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200">
                {type === 'registered' ? 'Tournament Hub' : 'View Details'}
            </button>
        </div>
    );
};

export default TournamentsPage;
