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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Substitutions</h2>
                <p className="text-neutral-400">
                    {substitutePlayers.length} Reserve Players
                </p>
            </div>

            {substitutePlayers.length === 0 ? (
                <div className="text-center py-8 bg-neutral-800/30 rounded-xl border border-neutral-700/50">
                    <p className="text-neutral-500 text-sm">No substitute players</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {substitutePlayers.map((player) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            onAction={handlePlayerAction}
                            isSelected={selectedPlayer?.id === player.id}
                            swapMode={swapMode}
                            cardStyle={'substitution'}
                            cancelSwap={cancelSwap}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
