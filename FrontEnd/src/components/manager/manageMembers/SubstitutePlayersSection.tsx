import { User, Users } from "lucide-react";
import type { TeamPlayer } from "../../../types/Player";
import PlayerCard from "./PlayerCard";

interface SubProps {
    substitutePlayers: TeamPlayer[];
    selectedPlayer: TeamPlayer | null;
    swapMode: boolean;
    cancelSwap: () => void;
    handlePlayerAction: (
        action: "swap" | "makeSubstitute" | "makeActive" | "view",
        player: TeamPlayer
    ) => void;
}

export function SubstitutePlayersSection({
    substitutePlayers,
    selectedPlayer,
    swapMode,
    cancelSwap,
    handlePlayerAction,
}: SubProps) {
    return (
        <div className="space-y-4">
            
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">The Bench</h2>
                        <p className="text-sm text-muted-foreground">
                            Substitutes & Reserves
                        </p>
                    </div>
                </div>

                <div className="px-3 py-1 bg-muted rounded-full text-xs font-bold text-muted-foreground border border-border">
                    {substitutePlayers.length} Reserves
                </div>
            </div>

            {/* Content Area - Visually distinct from Active section */}
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                {substitutePlayers.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                            <Users className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-muted-foreground font-medium text-sm">Bench is empty</p>
                        <p className="text-xs text-muted-foreground/60 max-w-[200px]">
                            Add players here to have them ready for substitution.
                        </p>
                    </div>
                ) : (
                    // Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {substitutePlayers.map((player) => (
                            <PlayerCard
                                key={player._id}
                                player={player}
                                onAction={handlePlayerAction}
                                isSelected={selectedPlayer?._id === player._id}
                                swapMode={swapMode}
                                cardStyle={'substitution'}
                                cancelSwap={cancelSwap}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}