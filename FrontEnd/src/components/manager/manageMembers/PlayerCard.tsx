import type { Player } from "../../../pages/manager/ManageMembers";
import { PlayerAvatar } from "../../ui/PlayerAvatar";
import { PlayerMenu } from "../../ui/player/PlayerMenu";
import { PlayerStatusBadge } from "../../ui/player/PlayerStatusBadge";

export interface PlayerCardProps {
    player: Player;
    onAction: (action: "swap" | "makeSubstitute" | "makeActive" | "view", player: Player) => void;
    isSelected: boolean;
    swapMode: boolean;
    compact?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onAction, isSelected, swapMode, }) => {
    const handleCardClick = () => {
        if (swapMode && !isSelected) onAction("swap", player);
    };

    return (
        <div
            className={`bg-neutral-800/50 rounded-xl border p-6 transition-all duration-200 
        ${isSelected
                    ? "border-blue-500 bg-blue-500/20"
                    : swapMode
                        ? "cursor-pointer border-yellow-500/50 hover:border-yellow-500 hover:bg-yellow-500/10"
                        : "border-neutral-700/50 hover:border-neutral-600/50"
                }`}
            onClick={handleCardClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                    <PlayerAvatar
                        jerseyNumber={player.jerseyNumber}
                        status={player.status}
                    />
                    <div>
                        <h3 className="text-md font-semibold">{player.name}</h3>
                        <p className="text-neutral-400 text-sm">{player.position}</p>
                    </div>
                </div>
                {!swapMode && <PlayerMenu player={player} onAction={onAction} />}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                    Performance: {player.performance}%
                </div>
                <div className="flex items-center">
                    Joined: {new Date(player.joinDate).toLocaleDateString()}
                </div>
            </div>

            <div className="mt-2 flex justify-between items-center">
                <PlayerStatusBadge status={player.status} />
            </div>
        </div>
    );
};

export default PlayerCard;