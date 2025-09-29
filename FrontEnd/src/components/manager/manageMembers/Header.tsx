import type { Player, Team } from "../../../pages/manager/ManageMembers";

interface HeaderProps {
    team: Team;
    playersCount: number;
    swapMode: boolean;
    selectedPlayer: Player | null;
    cancelSwap: () => void;
}

export function Header({
    team,
    playersCount,
    swapMode,
    selectedPlayer,
    cancelSwap,
}: HeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-semibold">Manage Team Members</h1>
                <p className="text-neutral-400">
                    {team.name} • {playersCount}/{team.maxPlayers} Players
                </p>
            </div>
            <div className="flex gap-3">
                {swapMode && selectedPlayer && (
                    <button
                        onClick={cancelSwap}
                        className="text-red-500 hover:underline text-sm font-medium transition-colors"
                    >
                        Cancel Swap
                    </button>
                )}
                <button className="bg-emerald-600 py-2 px-4 rounded-xl text-white hover:underline text-sm font-medium transition-colors">
                    Add Player +
                </button>
            </div>
        </div>
    );
}
