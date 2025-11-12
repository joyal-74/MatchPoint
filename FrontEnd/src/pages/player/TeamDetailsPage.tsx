import { MapPin, Users, Trophy, Calendar, ArrowLeft } from 'lucide-react';
import PlayerLayout from '../layout/PlayerLayout';
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useEffect } from 'react';
import { getMyTeamDetails } from '../../features/player/playerThunks';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { clearSelectedTeam, setSelectedTeam } from '../../features/player/Teams/TeamSlice';


const ViewTeam = () => {
    const { teamId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const allTeams = useAppSelector((state) => state.playerTeams.allTeams);
    const team = useAppSelector((state) => state.playerTeams.selectedTeam);
    const found = allTeams.find((t) => t._id === teamId);
    const loading = useAppSelector((state) => state.player.loading);

    useEffect(() => {
        if (teamId) {
            if (!found) {
                dispatch(getMyTeamDetails(teamId));
            } else {
                dispatch(setSelectedTeam(found));
            }
        }
    }, [teamId, found, dispatch]);


    if (loading) {
        return (
            <PlayerLayout>
                <LoadingOverlay show={true} />
            </PlayerLayout>
        );
    }

    if (!team) {
        return (
            <PlayerLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-neutral-500 dark:text-neutral-400">
                    <p className="text-sm mb-4">Fetching team details...</p>
                    <button
                        onClick={() => teamId && dispatch(getMyTeamDetails(teamId))}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </PlayerLayout>
        );
    }

    return (
        <>
            <PlayerLayout>
                <LoadingOverlay show={loading} />
                <div className="mt-6 w-full pr-12">
                    <div className="">
                        <button
                            onClick={() => {
                                dispatch(clearSelectedTeam());
                                navigate(-1);
                            }}
                            className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-3 transition-colors duration-200 text-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Teams</span>
                        </button>

                        <div className="flex gap-3">
                            <div className="w-2/7 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={team.logo}
                                            alt={team.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"
                                        />
                                        <div className="flex-1">
                                            <h1 className="text-xl font-bold text-neutral-800 dark:text-white">{team.name}</h1>
                                            <div className="flex items-center text-neutral-600 dark:text-neutral-400 mt-1">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span className="text-sm">{team.city}, {team.state}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded text-xs font-medium">
                                            {team.sport}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${team.phase === 'recruiting'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            : team.phase === 'active'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {team.phase}
                                        </span>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-3">About</h2>
                                    <p className="text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                        {team.description}
                                    </p>
                                </div>

                                {/* Team Stats */}
                                <div className="p-5">
                                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Team Stats</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Trophy className="w-5 h-5 text-amber-500" />
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">Win Rate</span>
                                            </div>
                                            <span className="font-bold text-neutral-800 dark:text-white">{team.stats.winRate}%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Users className="w-5 h-5 text-blue-500" />
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">Players</span>
                                            </div>
                                            <span className="font-bold text-neutral-800 dark:text-white">{team.membersCount}/{team.maxPlayers}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-5 h-5 text-green-500" />
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">Matches</span>
                                            </div>
                                            <span className="font-bold text-neutral-800 dark:text-white">{team.stats.totalMatches}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="flex-1 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                {/* Members Header */}
                                <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                {team.membersCount} of {team.maxPlayers} players
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Members Grid - 2 columns */}
                                <div className="p-3">
                                    <div className="grid grid-cols-3 gap-2">
                                        {team.members
                                            .filter((player) => player.approvalStatus === "approved").
                                            map((player) => (
                                                <div
                                                    key={player.playerId}
                                                    className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-600/50 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={player.profileImage || '/cricket-player.png'}
                                                            alt={player.firstName}
                                                            className="w-12 h-12 rounded-full object-cover border border-neutral-300 dark:border-neutral-500"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className="font-medium text-neutral-800 dark:text-white truncate text-sm">
                                                                {player.firstName + " " + player.lastName}
                                                            </h3>

                                                        </div>
                                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                                            {player.profile.position || 'na'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </PlayerLayout>
        </>

    );
};

export default ViewTeam;