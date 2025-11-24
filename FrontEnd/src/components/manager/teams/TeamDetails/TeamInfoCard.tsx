import { MapPin, Users, Target } from 'lucide-react';
import type { Team } from '../Types';

const TeamInfoCard = ({ team }: { team : Team }) => {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="text-center mb-6">
                <img
                    src={team.logo}
                    alt={team.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-neutral-100 dark:border-neutral-700 mx-auto mb-4"
                />
                <h1 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">{team.name}</h1>
                <div className="flex items-center justify-center space-x-1 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{team.city}, {team.state}</span>
                </div>
                <div className="flex justify-center space-x-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {team.sport}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${team.phase === 'recruiting'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : team.phase === 'active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                        }`}>
                        {team.phase}
                    </span>
                </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-center mb-6">
                {team.description}
            </p>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-2">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-lg font-bold text-neutral-800 dark:text-white">{team.membersCount}</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Current</p>
                    </div>
                    <div className="text-center p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-2">
                            <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-lg font-bold text-neutral-800 dark:text-white">{team.maxPlayers}</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Capacity</p>
                    </div>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Win Rate</span>
                        <span className="text-sm font-semibold text-neutral-800 dark:text-white">{team.stats.winRate}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${team.stats.winRate}%` }}
                        ></div>
                    </div>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Total Matches</span>
                        <span className="text-sm font-semibold text-neutral-800 dark:text-white">{team.stats.totalMatches}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamInfoCard;