import { X } from 'lucide-react';
import ModalBackdrop from '../../../ui/ModalBackdrop';
import type { PlayerDetails } from '../Types';

interface RemovePlayerModalProps {
    player: PlayerDetails;
    isOpen: boolean;
    onClose: () => void;
    onRemove: (playerId: string) => void;
}

const RemovePlayerModal = ({ player, isOpen, onClose, onRemove }: RemovePlayerModalProps) => {
    if (!isOpen) return null;

    const handleRemove = () => {
        onRemove(player.playerId);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <ModalBackdrop onClick={onClose} />

            <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-sm w-full mx-auto overflow-hidden shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Remove Player
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-4">
                    <img
                        src={player.profileImage || '/player.png'}
                        alt={player.firstName}
                        className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-neutral-200 dark:border-neutral-600 shadow-md"
                    />

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

                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to remove{' '}
                        <span className="font-semibold">{player.firstName}</span>
                        {" "}from your team?
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-medium
                                bg-neutral-200 dark:bg-neutral-700
                                text-neutral-700 dark:text-neutral-300
                                rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-600
                                transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleRemove}
                            className="flex-1 px-4 py-3 text-sm font-medium text-white
                                bg-red-600 rounded-xl
                                hover:bg-red-700
                                transition-colors
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemovePlayerModal;