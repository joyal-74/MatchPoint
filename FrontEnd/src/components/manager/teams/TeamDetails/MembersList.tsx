import { UserMinus, User } from "lucide-react";
import type { PlayerDetails } from '../Types';

interface MembersListProps {
    players: PlayerDetails[];
    openPlayerDetails: (player: PlayerDetails) => void;
    openRemoveModal: (player: PlayerDetails) => void;
}

const MembersList = ({
    players,
    openPlayerDetails,
    openRemoveModal
}: MembersListProps) => {
    
    // Empty State
    if (players.length === 0)
        return (
            <div className="text-center py-12 col-span-full border-2 border-dashed border-border rounded-xl bg-muted/20">
                <p className="text-muted-foreground text-sm font-medium">
                    No players have joined this team yet.
                </p>
            </div>
        );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
                <div 
                    key={player.playerId}
                    className="group relative flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => openPlayerDetails(player)}
                >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                            {player.profileImage ? (
                                <img
                                    src={player.profileImage}
                                    alt={player.firstName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-muted-foreground/50" />
                            )}
                        </div>
                        {/* Status Dot (Optional - visually indicates 'Active') */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full"></div>
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                            {player.firstName} {player.lastName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {player.profile?.position || 'Team Member'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openRemoveModal(player);
                            }}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Remove Player"
                            aria-label="Remove Player"
                        >
                            <UserMinus size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MembersList;