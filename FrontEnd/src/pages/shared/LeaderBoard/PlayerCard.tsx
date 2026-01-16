import React from 'react';
import type { TopPlayerStats } from "./leaderboardData";
import { User } from 'lucide-react';

interface PlayerCardProps {
    player: TopPlayerStats;
    rank?: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank }) => {
    const statLabel = player.hundreds === 1 ? 'Century' : '100s';

    return (
        <div className="flex flex-col bg-card border border-border rounded-lg p-4 min-w-[280px] hover:border-primary/50 transition-colors">
            
            {/* Header: Rank + Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                <div className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                    {rank && rank <= 3 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                            {rank}
                        </div>
                    )}
                </div>
                
                <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                        {player.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {player.handle || "Player"}
                    </p>
                </div>
            </div>

            {/* Stats Grid - Clean & Flat */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                <MinimalStat label="Matches" value={player.matches} />
                <MinimalStat label="Runs" value={player.runs} isPrimary />
                <MinimalStat label="Average" value={player.average} />
                <MinimalStat label="Strike Rate" value={player.strikeRate} />
                <MinimalStat label={statLabel} value={player.hundreds} />
                <MinimalStat label="Fifties" value={player.fifties} />
            </div>
        </div>
    );
};

const MinimalStat = ({ label, value, isPrimary = false }: { label: string, value: string | number, isPrimary?: boolean }) => (
    <div className="flex flex-col">
        <span className="text-[10px] uppercase text-muted-foreground font-medium mb-0.5">{label}</span>
        <span className={`font-mono ${isPrimary ? 'text-primary font-bold text-sm' : 'text-foreground'}`}>
            {value}
        </span>
    </div>
);

export default PlayerCard;