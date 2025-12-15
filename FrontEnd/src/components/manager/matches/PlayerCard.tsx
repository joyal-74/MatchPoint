import React from "react";
import { StatItem } from "./StatItem";
import type { Player } from "../../../features/manager/Matches/matchTypes";

export const PlayerCard: React.FC<{ player: Player }> = React.memo(({ player }) => {

    const { role, stats } = player;

    let selectedStats;

    if (role === "Batter") {
        selectedStats = {
            matches: stats.batting.matches,
            runs: stats.batting.runs,
            average: stats.batting.average,
            strikeRate: stats.batting.strikeRate,
        };
    }
    else if (role === "Bowler") {
        selectedStats = {
            matches: stats.bowling.matches,
            wickets: stats.bowling.wickets,
            economy: stats.bowling.economy,
        };
    }
    else {
        selectedStats = {
            matches: stats.batting.matches,
            runs: stats.batting.runs,
            average: stats.batting.average,
        };
    }

    return (
        <div className="
            flex flex-col p-3 bg-purple-900 border border-purple-800 rounded-lg shadow-lg 
            transition duration-200 hover:bg-purple-800 hover:border-purple-600
        ">
            
            <div className="flex justify-start gap-3 items-center mb-2">
                
                <div className="flex-shrink-0">
                    <img
                        className="w-10 h-10 rounded-full object-cover border border-purple-500/50"
                        src={player.profileImage}
                        alt={player.name}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'https://placehold.co/40x40/4F46E5/ffffff?text=P'; 
                        }}
                    />
                </div>

                <div className="flex-grow min-w-0">
                    <p className="font-semibold text-white truncate text-sm">{player.name}</p> {/* Original text-sm */}
                    <p className="text-xs text-purple-400">{player.role}</p>                   {/* Original text-xs */}
                </div>
                
            </div>

            <div className="flex flex-wrap justify-between border-t border-purple-900 pt-2 text-xs text-neutral-300">
                {Object.entries(selectedStats).map(([label, value]) => (
                    <StatItem
                        key={label}
                        label={
                            label === 'strikeRate' ? 'SR' :
                            label === 'average' ? 'AVG' :
                            label.charAt(0).toUpperCase() + label.slice(1)
                        }
                        value={value ?? 0}
                    />
                ))}
            </div>
            
        </div>
    );
});