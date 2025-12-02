import React from "react";
import { StatItem } from "./StatItem";
import type { Player } from "./matchTypes";

export const PlayerCard: React.FC<{ player: Player }> = React.memo(({ player }) => (
    <div className="flex items-center p-3 space-x-3 bg-purple-900/60 rounded-xl shadow-md transition duration-200 hover:bg-purple-800/70">
        <div className="flex-shrink-0">
            <img
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                src={player.imageUrl}
                alt={player.name}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/40x40/2563EB/ffffff?text=P'; // Fallback
                }}
            />
        </div>
        <div className="flex-grow text-sm">
            <p className="font-semibold text-white truncate">{player.name}</p>
            <div className="flex flex-wrap text-xs text-neutral-300 gap-x-3 mt-1">
                <StatItem label="Total Match" value={player.stats.totalMatch} />
                <StatItem label="Total Runs" value={player.stats.totalRuns} />
                <StatItem label="Average" value={player.stats.average.toFixed(1)} />
                <StatItem label="SR" value={player.stats.strikeRate.toFixed(1)} />
            </div>
        </div>
    </div>
));