import React, { useState } from 'react';
import {
    Trophy,
    Plus,
    Users,
    Search,
    Award,
    Target,
} from 'lucide-react';
import TournamentCard from '../../components/manager/tournaments/TournamentCard';
import ExploreCard from '../../components/manager/tournaments/ExploreCards';
import StatsCard from '../../components/manager/tournaments/StatsCard';

interface Tournament {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'upcoming' | 'completed';
    participants: number;
    maxParticipants: number;
    startDate: string;
    location: string;
    prize: string;
    image: string;
    organizer: string;
}

const TournamentDashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Sample data
    const myTournaments: Tournament[] = [
        {
            id: '1',
            name: 'Summer Chess Championship',
            type: 'Chess',
            status: 'active',
            participants: 24,
            maxParticipants: 32,
            startDate: '2024-01-15',
            location: 'Mumbai, India',
            prize: '₹50,000',
            image: '🏆',
            organizer: 'Chess Club Mumbai'
        },
        {
            id: '2',
            name: 'Gaming Legends Tournament',
            type: 'Esports',
            status: 'upcoming',
            participants: 8,
            maxParticipants: 16,
            startDate: '2024-02-01',
            location: 'Online',
            prize: '₹1,00,000',
            image: '🎮',
            organizer: 'GameHub India'
        },
        {
            id: '3',
            name: 'Cricket Premier League',
            type: 'Cricket',
            status: 'completed',
            participants: 16,
            maxParticipants: 16,
            startDate: '2024-01-01',
            location: 'Bengaluru, India',
            prize: '₹2,00,000',
            image: '🏏',
            organizer: 'Sports Authority'
        }
    ];

    const exploreTournaments: Tournament[] = [
        {
            id: '4',
            name: 'Badminton Open Championship',
            type: 'Badminton',
            status: 'upcoming',
            participants: 12,
            maxParticipants: 24,
            startDate: '2024-02-15',
            location: 'Delhi, India',
            prize: '₹75,000',
            image: '🏸',
            organizer: 'Badminton Federation'
        },
        {
            id: '5',
            name: 'Mobile Gaming Championship',
            type: 'Mobile Gaming',
            status: 'active',
            participants: 45,
            maxParticipants: 64,
            startDate: '2024-01-20',
            location: 'Online',
            prize: '₹1,50,000',
            image: '📱',
            organizer: 'Mobile Esports'
        }
    ];


    const stats = [
        { label: 'Active Tournaments', value: '12', icon: Trophy, color: 'text-green-400' },
        { label: 'Total Participants', value: '1,234', icon: Users, color: 'text-blue-400' },
        { label: 'Completed Events', value: '45', icon: Award, color: 'text-purple-400' },
        { label: 'Total Prize Pool', value: '₹15L', icon: Target, color: 'text-pink-400' }
    ];


    return (
        <>
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="border-b px-8 py-6" style={{
                    borderColor: 'var(--color-border)'
                }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Create & Mnagae Tournaments</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 text-sm rounded-xl flex items-center space-x-2 transition-colors shadow-lg">
                                <Plus className="w-5 h-5" />
                                <span className="font-medium">New Tournament</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Stats */}
                <div className="px-8 py-6">
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <StatsCard key={index} stat={stat} />
                        ))}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-8 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                            style={{ color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search tournaments..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-primary)'
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTournaments.map((tournament) => (
                            <TournamentCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exploreTournaments.map((tournament) => (
                            <ExploreCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TournamentDashboard;