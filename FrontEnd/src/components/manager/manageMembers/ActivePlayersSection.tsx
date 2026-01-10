import { Users, Shield, Plus} from "lucide-react";
import type { TeamPlayer } from "../../../types/Player";
import type { Team } from "../teams/Types";
import PlayerCard from "./PlayerCard";

interface ActiveProps {
    team: Team;
    activePlayers: TeamPlayer[];
    selectedPlayer: TeamPlayer | null;
    swapMode: boolean;
    cancelSwap: () => void;
    handlePlayerAction: (action: "swap" | "makeSubstitute" | "makeActive" | "view", player: TeamPlayer) => void;
}

export function ActivePlayersSection({ 
    team, 
    activePlayers, 
    selectedPlayer, 
    swapMode, 
    cancelSwap, 
    handlePlayerAction 
}: ActiveProps) {
    
    const maxActive = 11; 
    const isFull = activePlayers.length >= maxActive;
    const fillPercentage = (activePlayers.length / maxActive) * 100;

    return (
        <div className="space-y-6 mb-10">
            
            {/* 1. Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/10 shadow-sm">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Starting Lineup</h2>
                        <p className="text-sm text-muted-foreground font-medium">
                            {team.name}
                        </p>
                    </div>
                </div>

                {/* Capacity Visualizer */}
                <div className="flex flex-col items-end gap-2 min-w-[140px]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Squad Capacity
                    </span>
                    <div className="w-full flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-green-500' : 'bg-primary'}`}
                                style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-foreground">{activePlayers.length}/{maxActive}</span>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Grid */}
            {activePlayers.length === 0 ? (
                // Empty State with Call to Action
                <div className="rounded-xl border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/10 transition-colors">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Active Players</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mb-6">
                        Your starting lineup is empty. Add players from the bench or register new members to build your squad.
                    </p>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
                        <Plus size={16} />
                        Auto-Fill Lineup
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Render Active Players */}
                    {activePlayers.map((player) => (
                        <PlayerCard
                            key={player._id}
                            player={player}
                            onAction={handlePlayerAction}
                            isSelected={selectedPlayer?._id === player._id}
                            swapMode={swapMode}
                            cardStyle={'playing'}
                            cancelSwap={cancelSwap}
                        />
                    ))}
                    
                    {/* Render Open Slots (Visual placeholders) */}
                    {!isFull && Array.from({ length: maxActive - activePlayers.length }).map((_, i) => (
                        <div 
                            key={`slot-${i}`} 
                            className="
                                min-h-[160px] rounded-xl border-2 border-dashed border-border 
                                flex flex-col items-center justify-center gap-2
                                text-muted-foreground/40 bg-muted/5
                                hover:border-primary/30 hover:text-primary/60 hover:bg-primary/5
                                transition-all duration-300 group cursor-pointer
                            "
                            title="Open Slot"
                        >
                            <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                                <Plus size={20} />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Slot {activePlayers.length + i + 1}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}