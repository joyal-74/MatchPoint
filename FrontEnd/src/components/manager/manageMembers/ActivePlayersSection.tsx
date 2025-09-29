import type { Player, Team } from "../../../pages/manager/ManageMembers";
import PlayerCard from "./PlayerCard";

interface ActiveProps {
    team: Team;
    activePlayers: Player[];
    selectedPlayer: Player | null;
    swapMode: boolean;
    handlePlayerAction: (
        action: "swap" | "makeSubstitute" | "makeActive" | "view",
        player: Player
    ) => void;
}

export function ActivePlayersSection({
    team,
    activePlayers,
    selectedPlayer,
    swapMode,
    handlePlayerAction,
}: ActiveProps) {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{team.name}</h2>
                <p className="text-neutral-400">{activePlayers.length}/11 Active</p>
            </div>

            {activePlayers.length === 0 ? (
                <div className="text-center py-12 bg-neutral-800/30 rounded-xl border border-neutral-700/50">
                    <p className="text-neutral-500 text-lg mb-4">No active players</p>
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm">
                        Add Players to Playing 11
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activePlayers.map((player) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            onAction={handlePlayerAction}
                            isSelected={selectedPlayer?.id === player.id}
                            swapMode={swapMode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
