import { MapPin, Users, Trophy, Calendar, ArrowLeft, Mail, Phone, Check, X, Eye, Clock } from 'lucide-react';
import ManagerLayout from '../layout/ManagerLayout';
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useEffect, useState } from 'react';
import { getMyTeamDetails, approvePlayerRequest, rejectPlayerRequest } from '../../features/manager/managerThunks';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import ModalBackdrop from '../../components/ui/ModalBackdrop';
import type { Player } from '../../types/Player';

const ViewTeamManager = () => {
    const { teamId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const team = useAppSelector(state => state.manager.selectedTeam);
    const loading = useAppSelector(state => state.manager.loading);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [showPendingRequests, setShowPendingRequests] = useState(false);

    useEffect(() => {
        if (teamId && !team) {
            dispatch(getMyTeamDetails(teamId));
        }
    }, [teamId, team, dispatch]);

    const handleApprove = async (playerId: string) => {
        if (teamId) {
            await dispatch(approvePlayerRequest({ teamId, playerId }));
            dispatch(getMyTeamDetails(teamId));
        }
    };

    const handleReject = async (playerId: string) => {
        if (teamId) {
            await dispatch(rejectPlayerRequest({ teamId, playerId }));
            dispatch(getMyTeamDetails(teamId));
        }
    };

    const openPlayerDetails = (player: any) => {
        setSelectedPlayer(player);
        setIsPlayerModalOpen(true);
    };

    const closePlayerModal = () => {
        setIsPlayerModalOpen(false);
        setSelectedPlayer(null);
    };

    if (loading) {
        return (
            <ManagerLayout>
                <LoadingOverlay show={true} />
            </ManagerLayout>
        );
    }

    if (!team) {
        return (
            <ManagerLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-neutral-500 dark:text-neutral-400">
                    <p className="text-sm mb-4">Fetching team details...</p>
                    <button
                        onClick={() => teamId && dispatch(getMyTeamDetails(teamId))}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </ManagerLayout>
        );
    }

    const approvedPlayers = team.members?.filter((player: any) => player.approvalStatus === "approved") || [];
    const pendingPlayers = team.members?.filter((player: any) => player.approvalStatus === "pending") || [];

    return (
        <>
            <ManagerLayout>
                <LoadingOverlay show={loading} />
                <div className="mt-6 w-full pr-12">
                    <div className="">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-3 transition-colors duration-200 text-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Teams</span>
                        </button>

                        <div className="flex gap-3">
                            {/* Team Details - 1/3 width on LEFT */}
                            <div className="w-2/7 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                {/* Header with Team Info */}
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

                            {/* Team Members & Pending Requests */}
                            <div className="flex-1 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                {/* Members Header */}
                                <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">
                                                {showPendingRequests ? 'Pending Join Requests' : 'Team Members'}
                                            </h2>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                {showPendingRequests 
                                                    ? `${pendingPlayers.length} pending request${pendingPlayers.length !== 1 ? 's' : ''}`
                                                    : `${approvedPlayers.length} of ${team.maxPlayers} players`
                                                }
                                            </p>
                                        </div>
                                        
                                        {/* Pending Requests Toggle Button */}
                                        {pendingPlayers.length > 0 && (
                                            <button
                                                onClick={() => setShowPendingRequests(!showPendingRequests)}
                                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                    showPendingRequests
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                <Clock className="w-4 h-4" />
                                                <span>Pending ({pendingPlayers.length})</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Members Grid - 3 columns */}
                                <div className="p-3">
                                    {showPendingRequests ? (
                                        /* Pending Requests View */
                                        <div className="grid grid-cols-3 gap-2">
                                            {pendingPlayers.map((player: any) => (
                                                <div
                                                    key={player.playerId}
                                                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
                                                >
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        <img
                                                            src={player.profileImage}
                                                            alt={player.firstName}
                                                            className="w-12 h-12 rounded-full object-cover border border-neutral-300 dark:border-neutral-500"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-neutral-800 dark:text-white text-sm truncate">
                                                                {player.firstName} {player.lastName}
                                                            </h3>
                                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                                                {player.profile?.position || 'No position'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-1 ml-2">
                                                        <button
                                                            onClick={() => openPlayerDetails(player)}
                                                            className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                                                            title="View player details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(player.playerId)}
                                                            className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors duration-200"
                                                            title="Approve player"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(player.playerId)}
                                                            className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                                                            title="Reject player"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Approved Members View */
                                        <div className="grid grid-cols-3 gap-2">
                                            {approvedPlayers.map((player: any) => (
                                                <div
                                                    key={player.playerId}
                                                    className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-600/50 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={player.profileImage}
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
                                                            {player.profile?.position || 'No position'}
                                                        </p>

                                                        {/* Always visible contact actions under position */}
                                                        <div className="flex space-x-1 mt-1">
                                                            <button
                                                                className="p-1.5 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                                                                title="Send email"
                                                            >
                                                                <Mail className="w-3.5 h-3.5" />
                                                            </button>
                                                            {player.phone && (
                                                                <button
                                                                    className="p-1.5 text-neutral-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors duration-200"
                                                                    title="Call"
                                                                >
                                                                    <Phone className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ManagerLayout>

            {/* Player Details Modal */}
            {selectedPlayer && (
                <PlayerDetailsModal
                    player={selectedPlayer}
                    isOpen={isPlayerModalOpen}
                    onClose={closePlayerModal}
                    onApprove={() => handleApprove(selectedPlayer.playerId)}
                    onReject={() => handleReject(selectedPlayer.playerId)}
                />
            )}
        </>
    );
};

// Player Details Modal Component (unchanged)
const PlayerDetailsModal = ({ player, isOpen, onClose, onApprove, onReject }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <ModalBackdrop onClick={onClose} />
            <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50">
                {/* Header */}
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-white">Player Details</h2>
                        <button
                            onClick={onClose}
                            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Player Info */}
                <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <img
                            src={player.profileImage}
                            alt={player.firstName}
                            className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"
                        />
                        <div>
                            <h3 className="text-lg font-bold text-neutral-800 dark:text-white">
                                {player.firstName} {player.lastName}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">{player.profile?.position || 'No position'}</p>
                            <div className="flex items-center space-x-4 mt-2">
                                {player.email && (
                                    <div className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-400">
                                        <Mail className="w-4 h-4" />
                                        <span>{player.email}</span>
                                    </div>
                                )}
                                {player.phone && (
                                    <div className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-400">
                                        <Phone className="w-4 h-4" />
                                        <span>{player.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Player Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">Batting Stats</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Matches:</span>
                                    <span className="font-medium">{player.stats?.batting?.matches || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Runs:</span>
                                    <span className="font-medium">{player.stats?.batting?.runs || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Average:</span>
                                    <span className="font-medium">{player.stats?.batting?.average || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Strike Rate:</span>
                                    <span className="font-medium">{player.stats?.batting?.strikeRate || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">Bowling Stats</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Matches:</span>
                                    <span className="font-medium">{player.stats?.bowling?.matches || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Wickets:</span>
                                    <span className="font-medium">{player.stats?.bowling?.wickets || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Economy:</span>
                                    <span className="font-medium">{player.stats?.bowling?.economy || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600 dark:text-neutral-400">Average:</span>
                                    <span className="font-medium">{player.stats?.bowling?.average || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">Additional Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Preferred Role:</span>
                                <span className="font-medium">{player.profile?.preferredRole || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 dark:text-neutral-400">Playing Style:</span>
                                <span className="font-medium">{player.profile?.playingStyle || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 justify-end">
                        <button
                            onClick={onReject}
                            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Reject
                        </button>
                        <button
                            onClick={onApprove}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Approve Player
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeamManager;