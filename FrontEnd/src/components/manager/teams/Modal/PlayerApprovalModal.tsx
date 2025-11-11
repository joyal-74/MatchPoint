import { X } from 'lucide-react';
import ModalBackdrop from '../../../ui/ModalBackdrop';
import type { PlayerDetails } from '../Types';

interface PlayerApprovalModalProps {
    player: PlayerDetails;
    isOpen: boolean;
    onClose: () => void;
    onApprove: (playerId: string) => void;
    onReject: (playerId: string) => void;
}

const PlayerApprovalModal = ({ player, isOpen, onClose, onApprove, onReject }: PlayerApprovalModalProps) => {
    if (!isOpen) return null;

    const handleApprove = () => {
        onApprove(player.playerId);
        onClose();
    };

    const handleReject = () => {
        onReject(player.playerId);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <ModalBackdrop onClick={onClose} />
            <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-sm w-full mx-auto overflow-hidden shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Player Request</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 text-center space-y-4">
                    <div className="relative">
                        <img
                            src={player.profileImage || '/placeholder.png'}
                            alt={`${player.firstName} ${player.lastName}`}
                            className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-neutral-200 dark:border-neutral-600 shadow-md"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {player.firstName} {player.lastName}
                        </h3>
                        {player.profile?.position && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {player.profile.position}
                            </p>
                        )}
                    </div>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Approve or reject {player.firstName}'s request to join your team?
                    </p>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleReject}
                            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 border border-red-400 rounded-xl hover:bg-red-100 dark:border-red-600 dark:hover:bg-red-950/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleApprove}
                            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerApprovalModal;