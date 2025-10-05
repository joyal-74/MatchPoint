import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Users, Trophy, Clock, Filter, Search, Star, Award } from 'lucide-react';
import type { Tournament } from '../../features/manager/managerTypes';
import Navbar from '../../components/player/Navbar';


type TournamentTab = 'upcoming' | 'ongoing' | 'completed' | 'registered';

const tournaments: Tournament[] = [
    {
        id: '1',
        title: 'Champions Trophy 2025',
        startDate: '2025-11-10',
        endDate: '2025-11-20',
        format: 'T20',
        location: 'Mumbai, India',
        teams: ['Team A', 'Team B', 'Team C', 'Team D'],
        isRegistered: true,
        prizePool: '₹5,00,000',
        earlyBirdDiscount: true
    },
    {
        id: '2',
        title: 'World Cup 2025',
        startDate: '2025-12-01',
        endDate: '2025-12-25',
        format: 'ODI',
        location: 'London, UK',
        teams: ['Team E', 'Team F', 'Team G', 'Team H'],
        isRegistered: false,
        prizePool: '$1,000,000',
        earlyBirdDiscount: false
    },
    {
        id: '3',
        title: 'The Hundred Invitational',
        startDate: '2025-10-15',
        endDate: '2025-10-30',
        format: 'The Hundred',
        location: 'Birmingham, UK',
        teams: ['Team I', 'Team J'],
        isRegistered: true,
        prizePool: '£200,000',
        earlyBirdDiscount: true
    },
    {
        id: '4',
        title: 'Test Series Championship',
        startDate: '2025-09-01',
        endDate: '2025-09-20',
        format: 'Test',
        location: 'Sydney, Australia',
        teams: ['Team K', 'Team L', 'Team M'],
        isRegistered: false,
        prizePool: 'AUD 500,000',
        earlyBirdDiscount: false
    }
];


const TournamentsPage = () => {
    const [activeTab, setActiveTab] = useState<TournamentTab>('upcoming');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFormat, setSelectedFormat] = useState<string>('all');

    // Filter tournaments based on active tab and search
    const filteredTournaments = tournaments.filter(tournament => {
        const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFormat = selectedFormat === 'all' || tournament.format === selectedFormat;

        if (!matchesSearch || !matchesFormat) return false;

        const now = new Date();
        const startDate = new Date(tournament.startDate);
        const endDate = new Date(tournament.endDate);

        switch (activeTab) {
            case 'upcoming':
                return startDate > now;
            case 'ongoing':
                return startDate <= now && endDate >= now;
            case 'completed':
                return endDate < now;
            case 'registered':
                return tournament.isRegistered; // Assuming this property exists
            default:
                return true;
        }
    });

    const tournamentFormats = ['all', 'T20', 'ODI', 'Test', 'The Hundred'];

    return (
        <>
            <Navbar />

            <div className="min-h-screen mt-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
                <div className="container mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                            Discover and register for exciting cricket tournaments. Compete with teams worldwide and showcase your skills.
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center shadow-sm">
                            <div className="flex justify-center mb-2">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">12</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Tournaments Played</div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center shadow-sm">
                            <div className="flex justify-center mb-2">
                                <Award className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">3</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Trophies Won</div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center shadow-sm">
                            <div className="flex justify-center mb-2">
                                <Star className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">8.7</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Avg. Rating</div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center shadow-sm">
                            <div className="flex justify-center mb-2">
                                <Users className="w-6 h-6 text-green-500" />
                            </div>
                            <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">24</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Teams Faced</div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 mb-8 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search tournaments..."
                                        className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent text-neutral-800 dark:text-neutral-200 placeholder-neutral-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <select
                                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent text-neutral-800 dark:text-neutral-200"
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                >
                                    {tournamentFormats.map(format => (
                                        <option key={format} value={format}>
                                            {format === 'all' ? 'All Formats' : format}
                                        </option>
                                    ))}
                                </select>

                                <button className="flex items-center space-x-2 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300">
                                    <Filter className="w-4 h-4" />
                                    <span>More Filters</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex overflow-x-auto space-x-1 mb-8 bg-white dark:bg-neutral-800 rounded-xl p-1 shadow-sm">
                        {[
                            { id: 'upcoming' as TournamentTab, label: 'Upcoming', icon: Clock },
                            { id: 'ongoing' as TournamentTab, label: 'Ongoing', icon: Trophy },
                            { id: 'completed' as TournamentTab, label: 'Completed', icon: Award },
                            { id: 'registered' as TournamentTab, label: 'My Tournaments', icon: Users }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
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

                    {/* Tournaments Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {filteredTournaments.map((tournament, index) => (
                            <TournamentCard
                                key={tournament.id || index}
                                tournament={tournament}
                                type={activeTab}
                            />
                        ))}
                    </div>

                    {filteredTournaments.length === 0 && (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                                No tournaments found
                            </h3>
                            <p className="text-neutral-500 dark:text-neutral-500">
                                Try adjusting your search or filters to find more tournaments.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// Enhanced Tournament Card Component
interface TournamentCardProps {
    tournament: Tournament;
    type: TournamentTab;
}

const TournamentCard = ({ tournament, type }: TournamentCardProps) => {
    const getStatusBadge = () => {
        const now = new Date();
        const startDate = new Date(tournament.startDate);
        const endDate = new Date(tournament.endDate);

        if (type === 'completed') {
            return { label: 'Completed', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' };
        }

        if (type === 'ongoing') {
            return { label: 'Live', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' };
        }

        if (startDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
            return { label: 'Starting Soon', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' };
        }

        return { label: 'Upcoming', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' };
    };

    const status = getStatusBadge();

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                    </span>
                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-sm font-medium">
                        {tournament.format}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {tournament.prizePool}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Prize Pool
                    </div>
                </div>
            </div>

            <h3 className="font-bold text-lg mb-3 text-neutral-800 dark:text-neutral-200 line-clamp-2">
                {tournament.title}
            </h3>

            <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <Users className="w-4 h-4" />
                    <span>{tournament.teams?.length || 0} Teams Registered</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{tournament.location}</span>
                </div>
            </div>

            <div className="flex space-x-3">
                {type === 'completed' ? (
                    <>
                        <button className="flex-1 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 py-2 rounded-lg font-semibold transition-colors duration-200 text-center">
                            View Stats
                        </button>
                        <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200 text-center">
                            Highlights
                        </button>
                    </>
                ) : type === 'registered' ? (
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200">
                        Tournament Hub
                    </button>
                ) : (
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200">
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
};

export default TournamentsPage;