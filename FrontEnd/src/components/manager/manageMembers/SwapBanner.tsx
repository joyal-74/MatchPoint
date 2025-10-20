import type { TeamPlayer } from "../../../types/Player";

interface SwapBannerProps {
    player: TeamPlayer;
    cancelSwap: () => void;
}

export function SwapBanner({ player, cancelSwap }: SwapBannerProps) {
    return (
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-3"></div>
                    <span className="text-blue-300">
                        Swap mode: Select a player to swap with{" "}
                        <strong>{player.name}</strong>
                    </span>
                </div>
                <button onClick={cancelSwap} className="text-blue-300 hover:text-white">
                    Cancel
                </button>
            </div>
        </div>
    );
}
