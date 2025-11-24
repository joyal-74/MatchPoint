import { Calendar, Eye, MapPin, Star, UserPlus, Users } from "lucide-react";

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

const ExploreCard: React.FC<{ tournament: Tournament }> = ({ tournament }) => (
    <div className="tournament-card p-6">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
                <div className="text-4xl">{tournament.image}</div>
                <div>
                    <h3 className="font-bold text-lg text-white">{tournament.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {tournament.type} • {tournament.organizer}
                    </p>
                </div>
            </div>
            <span className={`status-badge status-${tournament.status}`}>
                {tournament.status}
            </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <span>{tournament.participants}/{tournament.maxParticipants}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <span>{tournament.startDate}</span>
            </div>
            <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <span>{tournament.location}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <span>{tournament.prize}</span>
            </div>
        </div>

        <div className="flex space-x-2">
            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <UserPlus className="w-4 h-4" />
                <span>Join Tournament</span>
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default ExploreCard;