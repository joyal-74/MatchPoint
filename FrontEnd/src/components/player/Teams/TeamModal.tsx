import { X, MapPin, Users, Trophy, Calendar, Target } from 'lucide-react';
import type { Team } from './Types';
import { useAppSelector } from '../../../hooks/hooks';

interface TeamModalProps {
    team: Team;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ team, isOpen, onClose, onSubmit }) => {
    const { approvedTeams, pendingTeams } = useAppSelector(state => state.player);

    let status: 'joined' | 'pending' | 'none' = 'none';
    if (approvedTeams.some(t => t._id === team._id)) status = 'joined';
    else if (pendingTeams.some(t => t._id === team._id)) status = 'pending';


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-neutral-700/50 shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header with colored accent */}
                <div className={`h-1 ${team.phase === 'recruiting' ? 'bg-blue-500' :
                    team.phase === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />

                <div className="p-6">
                    {/* Header with close button */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Team Details</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded text-xs font-medium">
                                    {team.sport}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${team.phase === 'recruiting'
                                    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                                    : 'bg-green-500/10 text-green-700 dark:text-green-300'
                                    }`}>
                                    {team.phase}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        </button>
                    </div>

                    {/* Team Identity */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <img
                                src={team.logo}
                                alt={team.name}
                                className="relative w-16 h-16 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-neutral-800 dark:text-white truncate">{team.name}</h4>
                            <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{team.city}, {team.state}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-6">
                        {team.description}
                    </p>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {/* Players */}
                        <div className="bg-white/50 dark:bg-neutral-800/50 p-3 rounded-xl border border-white/20 dark:border-neutral-700/50">
                            <div className="flex gap-2 mb-1">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">Players</span>
                            </div>
                            <div className="font-semibold text-neutral-800 dark:text-white">
                                {team.membersCount || 0}/{team.maxPlayers}
                            </div>
                        </div>

                        {/* Win Rate */}
                        <div className="bg-white/50 dark:bg-neutral-800/50 p-3 rounded-xl border border-white/20 dark:border-neutral-700/50">
                            <div className="flex gap-2 mb-1">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">Win Rate</span>
                            </div>
                            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {team.stats.winRate}%
                            </div>
                        </div>

                        {/* Matches */}
                        <div className="bg-white/50 dark:bg-neutral-800/50 p-3 rounded-xl border border-white/20 dark:border-neutral-700/50">
                            <div className="flex gap-2 mb-1">
                                <Target className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">Matches</span>
                            </div>
                            <div className="font-semibold text-neutral-800 dark:text-white">
                                {team.stats.totalMatches}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-white/50 dark:bg-neutral-800/50 p-3 rounded-xl border border-white/20 dark:border-neutral-700/50">
                            <div className="flex gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">Status</span>
                            </div>
                            <div className="font-semibold text-neutral-800 dark:text-white capitalize">
                                {team.phase}
                            </div>
                        </div>
                    </div>


                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-600 dark:text-neutral-400">Team Capacity</span>
                            <span className="font-medium text-neutral-800 dark:text-white">
                                {Math.round((team.membersCount / team.maxPlayers) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(team.membersCount / team.maxPlayers) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex">
                        <button
                            onClick={onSubmit}
                            disabled={status !== 'none'}
                            className={`flex-1 py-3 rounded-xl font-medium transition-colors duration-200 shadow-lg
                                 ${status === 'joined'
                                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                                    : status === 'pending'
                                        ? "bg-amber-500/90 text-white cursor-not-allowed shadow-none"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25"
                                }`}
                        >
                            {status === 'joined'
                                ? 'Already Joined'
                                : status === 'pending'
                                    ? 'Request Pending'
                                    : 'Join Team'}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default TeamModal;