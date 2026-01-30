import React from "react";
import { User } from "lucide-react";
import type { Player, PlayerStats } from "../../../domain/match/types";


export const PlayerCard: React.FC<{ player: Player }> = React.memo(({ player }) => {
    const { role, stats } = player;

    function isPlayerStats(stats: any): stats is PlayerStats {
        return (
            stats &&
            typeof stats === "object" &&
            "batting" in stats &&
            "bowling" in stats &&
            "fielding" in stats
        );
    }


    let selectedStats: Record<string, number> = {};

    if (!stats || !isPlayerStats(stats)) {
        selectedStats = { Mat: 0, Runs: 0, Avg: 0 };
    } else if (role === "Batter") {
        selectedStats = {
            Mat: stats.batting.matches,
            Runs: stats.batting.runs,
            Avg: stats.batting.average,
        };
    } else if (role === "Bowler") {
        selectedStats = {
            Mat: stats.bowling.matches,
            Wkts: stats.bowling.wickets,
            Eco: stats.bowling.economy,
        };
    } else {
        selectedStats = {
            Mat: stats.batting.matches,
            Runs: stats.batting.runs,
            Avg: stats.batting.average,
        };
    }


    return (
        <div className="
            group relative flex flex-col bg-card border border-border rounded-xl p-3
            hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 
            transition-all duration-300 cursor-default overflow-hidden
        ">
            {/* Top Section */}
            <div className="flex items-center gap-3 mb-3 z-10">
                <div className="relative">
                    {player.profileImage ? (
                        <img
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all"
                            src={player.profileImage}
                            alt={player.name}
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/222/fff?text=P'}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                            <User size={18} className="text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-card-foreground truncate">{player.name}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">{role}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-auto grid grid-cols-3 gap-1 bg-muted/40 rounded-lg p-2 border border-border/50">
                {Object.entries(selectedStats).map(([label, value]) => (
                    <div key={label} className="flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-foreground">{value ?? 0}</span>
                        <span className="text-[9px] text-muted-foreground uppercase">{label}</span>
                    </div>
                ))}
            </div>

            {/* Hover Decorator */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-3xl pointer-events-none" />
        </div>
    );
});