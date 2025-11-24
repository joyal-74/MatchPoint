import { MapPin, Users, ChevronRight } from 'lucide-react';
import type { Team } from './Types';

interface TeamListItemProps {
    team: Team;
    onViewDetails: (team: Team) => void;
}

const TeamListItem: React.FC<TeamListItemProps> = ({ team, onViewDetails }) => {
    return (
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Team Logo */}
                    <img
                        src={team.logo}
                        alt={team.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    <div className="flex-1">
                        {/* Name + Phase */}
                        <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">{team.name}</h3>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${team.phase === 'recruiting' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                        team.phase === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                            'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {team.phase.charAt(0).toUpperCase() + team.phase.slice(1)}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-2 line-clamp-2">
                            {team.description}
                        </p>

                        {/* Info Row: City, Players */}
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{team.city}, {team.state}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{team.membersCount || 0}/{team.maxPlayers} players</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions: Win Rate + Save + View */}
                <div className="flex items-center space-x-3">
                    <div className="text-right mr-4">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Win Rate</div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">{team.stats.winRate}%</div>
                    </div>

                    <button
                        onClick={() => onViewDetails(team)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                        <span>View Team</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamListItem;