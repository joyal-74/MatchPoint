import { X, User, AlertTriangle } from 'lucide-react';
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

            {/* Modal Container */}
            <div className="bg-card text-card-foreground border border-border rounded-2xl max-w-sm w-full mx-auto overflow-hidden shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        Remove Player
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-6">
                    
                    {/* Player Avatar with Destructive Indicator */}
                    <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden shadow-sm mx-auto">
                            {player.profileImage ? (
                                <img
                                    src={player.profileImage}
                                    alt={player.firstName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-muted-foreground" />
                            )}
                        </div>
                        {/* Warning Icon Decoration */}
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-destructive text-destructive-foreground rounded-full border-2 border-card flex items-center justify-center shadow-sm">
                            <AlertTriangle size={14} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground">
                            {player.firstName} {player.lastName}
                        </h3>

                        {player.profile?.position ? (
                            <p className="text-sm font-medium text-primary">
                                {player.profile.position}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">Team Member</p>
                        )}
                    </div>

                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                        <p className="text-sm text-destructive-foreground/80 dark:text-red-400 font-medium leading-relaxed">
                            Are you sure you want to remove <span className="font-bold underline">{player.firstName}</span> from your team? This action cannot be undone.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 rounded-xl transition-colors active:scale-95"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleRemove}
                            className="flex-1 px-4 py-3 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl transition-colors shadow-lg shadow-destructive/20 active:scale-95"
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