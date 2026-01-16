import { UserPlus, Users, Shield } from "lucide-react";
import type { Team } from "../teams/Types";

interface HeaderProps {
    team: Team;
    playersCount: number;
    onAddPlayerClick: () => void;
}

export function Header({ team, playersCount, onAddPlayerClick }: HeaderProps) {
    
    // Calculate fill percentage for the visual bar
    const maxPlayers = team?.maxPlayers || 0;
    const fillPercentage = Number(maxPlayers) > 0 ? (playersCount / Number(maxPlayers)) * 100 : 0;
    const isFull = playersCount >= Number(maxPlayers);

    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border pb-6">
            
            {/* Left Side: Title & Context */}
            <div className="space-y-1.5">
                {/* Eyebrow Label */}
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    <Shield size={12} />
                    <span>{team?.name || 'Team Management'}</span>
                </div>

                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Manage Roster
                </h1>

                {/* Meta Info with Visual Bar */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                        <Users size={14} />
                        <span className="font-medium text-foreground">{playersCount}</span>
                        <span className="opacity-60">/ {maxPlayers} Players</span>
                    </div>
                    
                    {/* Capacity Progress Bar */}
                    <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-yellow-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Side: Actions */}
            <button 
                onClick={onAddPlayerClick}
                disabled={isFull}
                className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95
                    ${isFull 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md shadow-primary/20'
                    }
                `}
                title={isFull ? "Team capacity reached" : "Add a new player"}
            >
                <UserPlus size={18} />
                {isFull ? 'Roster Full' : 'Add Player'}
            </button>
        </div>
    );
}