import { MapPin, Heart, Eye } from 'lucide-react';
import type { Team } from './Types';

interface TeamCardProps {
    team: Team;
    isSaved: boolean;
    onSaveToggle: (teamId: string) => void;
    onViewDetails: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, isSaved, onSaveToggle, onViewDetails }) => {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            {/* Colored Top Bar */}
            <div className={`h-1.5 w-full ${
                team.phase === 'recruiting' ? 'bg-blue-500' :
                team.phase === 'active' ? 'bg-green-500' :
                'bg-gray-500'
            }`} />
            
            <div className="p-4">
                {/* Header: Logo + Name + Save */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <img
                            src={team.logo}
                            alt={team.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-neutral-800 dark:text-white truncate">{team.name}</h3>
                            <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="truncate">{team.city}, {team.state}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onSaveToggle(team._id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                            isSaved
                                ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-pink-100 dark:hover:bg-pink-900/30'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Sport & Phase */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded text-xs font-medium">
                        {team.sport}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        team.phase === 'recruiting' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                            : team.phase === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                    }`}>
                        {team.phase.charAt(0).toUpperCase() + team.phase.slice(1)}
                    </span>
                </div>

                {/* Description */}
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {team.description}
                </p>

                {/* Players & Progress */}
                <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-neutral-500 dark:text-neutral-400">Players</span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {team.members.length}/{team.maxPlayers}
                        </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                        <div 
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(team.members.length / team.maxPlayers) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Footer: View + Win Rate */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => onViewDetails(team)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                    </button>

                    <div className="text-right">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Win Rate</div>
                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {team.stats.winRate}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;