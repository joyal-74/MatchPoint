import { X, Mail, Phone } from 'lucide-react';
import type { TeamPlayer } from '../../../types/Player';
import ModalBackdrop from '../../ui/ModalBackdrop';


interface TeamPlayerModalProps {
    player: TeamPlayer;
    isOpen: boolean;
    onClose: () => void;
}

const TeamPlayerModal = ({ player, isOpen, onClose }: TeamPlayerModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <ModalBackdrop onClick={onClose} />
            <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-50 shadow-xl">
                {/* Header */}
                <div className="p-5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-neutral-800 dark:text-white">Player Details</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Avatar + Basic Info */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20 overflow-hidden">
                            {player.profileImage ? (
                                <img
                                    src={player.profileImage}
                                    alt={player.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                player.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                                {player.name}
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {player.position || 'Unknown position'}
                            </p>
                            <div className="mt-2 flex items-center space-x-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${player.status === 'playing'
                                            ? 'bg-green-500/20 border-green-500/30 text-green-300'
                                            : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-300'
                                        }`}
                                >
                                    {player.status}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${player.approvalStatus === 'approved'
                                            ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                                            : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                                        }`}
                                >
                                    {player.approvalStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg space-y-2">
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                            <strong>Jersey Number:</strong> {player.jerseyNumber || 'N/A'}
                        </p>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                            <strong>Position:</strong> {player.position || 'N/A'}
                        </p>
                    </div>

                    {/* Contact Info (if available) */}
                    {player.email || player.phone ? (
                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg mt-4 space-y-2">
                            <h4 className="text-sm font-semibold text-neutral-800 dark:text-white mb-2">
                                Contact Information
                            </h4>
                            {player.email && (
                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <Mail className="w-4 h-4" />
                                    <span>{player.email}</span>
                                </div>
                            )}
                            {player.phone && (
                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <Phone className="w-4 h-4" />
                                    <span>{player.phone}</span>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default TeamPlayerModal;
