import React from "react";
import type { Player } from "../../../features/manager/Matches/matchTypes";

export const PlayerCard: React.FC<{ player: Player }> = React.memo(({ player }) => {
    const { role, stats } = player;

    let selectedStats;
    if (role === "Batter") {
        selectedStats = { M: stats.batting.matches, Runs: stats.batting.runs, Avg: stats.batting.average };
    } else if (role === "Bowler") {
        selectedStats = { M: stats.bowling.matches, Wkts: stats.bowling.wickets, Eco: stats.bowling.economy };
    } else {
        selectedStats = { M: stats.batting.matches, Runs: stats.batting.runs, Avg: stats.batting.average };
    }

    return (
        <div className="
            flex flex-col rounded-2xl bg-[#0f0f11] border border-[#27272a] 
            hover:border-purple-500/30 hover:bg-[#131316] hover:shadow-xl hover:shadow-purple-900/10 
            transition-all duration-300 p-3
        ">
            {/* Header: Image & Name */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 overflow-hidden">
                    <img
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1f1f22]"
                        src={player.profileImage}
                        alt={player.name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1f1f22/ffffff?text=P';
                        }}
                    />
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-semibold text-gray-200 truncate">{player.name}</span>
                        <span className="text-[10px] text-purple-400 font-medium tracking-wide uppercase">{player.role}</span>
                    </div>
                </div>
            </div>

            {/* Stats: Pill Design */}
            <div className="flex items-center justify-between bg-[#18181b] rounded-lg p-2 mt-auto">
                {Object.entries(selectedStats).map(([label, value]) => (
                    <div key={label} className="flex flex-col items-center min-w-[30%]">
                        <span className="text-xs font-bold text-gray-100">{value ?? 0}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});