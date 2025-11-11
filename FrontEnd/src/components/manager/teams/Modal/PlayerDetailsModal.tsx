import { X, Mail, Phone } from 'lucide-react';
import ModalBackdrop from '../../../ui/ModalBackdrop';
import type { PlayerDetails } from '../Types';

interface PlayerDetailsModalProps {
    player: PlayerDetails;
    isOpen: boolean;
    onClose: () => void;
}

const PlayerDetailsModal = ({ player, isOpen, onClose }: PlayerDetailsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <ModalBackdrop onClick={onClose} />
            <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50">
                <div className="p-5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white">Player Details</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Player Info */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20 overflow-hidden">
                            {player.profileImage ? (
                                <img src={player.profileImage} alt={player.firstName} className="w-full h-full object-cover" />
                            ) : (
                                player.firstName.charAt(0).toUpperCase()
                            )}
                        </div>
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

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">Batting Stats</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Matches: {player.stats?.batting?.matches || 0}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Runs: {player.stats?.batting?.runs || 0}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Average: {player.stats?.batting?.average || 0}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Strike Rate: {player.stats?.batting?.strikeRate || 0}</p>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">Bowling Stats</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Matches: {player.stats?.bowling?.matches || 0}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Wickets: {player.stats?.bowling?.wickets || 0}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Economy: {player.stats?.bowling?.economy || 0}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Average: {player.stats?.bowling?.average || 0}</p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">Additional Information</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Preferred Role: {player.profile?.position || 'Not specified'}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Batting Style: {player.profile?.battingStyle || 'Not specified'}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Bowling Style: {player.profile?.bowlingStyle || 'Not specified'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailsModal;