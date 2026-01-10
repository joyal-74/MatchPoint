import { X, User } from 'lucide-react';
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
            
            {/* Modal Container */}
            <div className="bg-card text-card-foreground border border-border rounded-2xl max-w-sm w-full mx-auto overflow-hidden shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Player Request</h2>
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
                    
                    {/* Player Avatar */}
                    <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden shadow-sm mx-auto">
                            {player.profileImage ? (
                                <img
                                    src={player.profileImage}
                                    alt={`${player.firstName} ${player.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-muted-foreground" />
                            )}
                        </div>
                        {/* Status Badge Decoration */}
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-yellow-500 border-2 border-card rounded-full" title="Pending"></div>
                    </div>
                    
                    {/* Player Details */}
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground">
                            {player.firstName} {player.lastName}
                        </h3>
                        {player.profile?.position ? (
                            <p className="text-sm font-medium text-primary">
                                {player.profile.position}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">Unknown Position</p>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed px-4">
                        Do you want to add <span className="font-semibold text-foreground">{player.firstName}</span> to your team roster?
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleReject}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleApprove}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/20 active:scale-95"
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