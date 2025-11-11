import { Eye, Check, X } from 'lucide-react';
import type { PlayerDetails } from '../Types';


const PendingList = ({
    players,
    openPlayerDetails,
    openApprovalModal,
}: {
    players: PlayerDetails[];
    openPlayerDetails: (player: PlayerDetails) => void;
    openApprovalModal: (player: PlayerDetails) => void;
}) => {
    if (players.length === 0)
        return (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                No pending requests at the moment.
            </p>
        );

    return (
        <div className="space-y-4">
            {players.map((player) => (
                <div
                    key={player.playerId}
                    className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
                >
                    <div className="flex items-center space-x-3 flex-1">
                        <img
                            src={player.profileImage || '/placeholder.png'}
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
                    <div className="flex items-center space-x-2 ml-4">
                        <button
                            onClick={() => openPlayerDetails(player)}
                            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="View details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => openApprovalModal(player)}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                            title="Approve/Reject"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => openApprovalModal(player)}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Reject"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PendingList;
