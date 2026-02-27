import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tournament } from "../../features/player/Tournnaments/tournamentType";

type TournamentTab = 'upcoming' | 'ongoing' | 'completed' | 'registered';

interface TournamentCardProps {
    tournament: Tournament;
    type: TournamentTab;
}

export const TournamentCard = ({ tournament, type }: TournamentCardProps) => {
    const navigate = useNavigate();

    const startDate = new Date(tournament.startDate);
    const dateStr = startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    // Status Logic
    const getTheme = () => {
        switch (type) {
            case 'ongoing':
                return {
                    accent: 'bg-red-500',
                    border: 'hover:border-red-500/50',
                    text: 'LIVE'
                };
            case 'registered':
                return {
                    accent: 'bg-purple-500',
                    border: 'hover:border-purple-500/50',
                    text: 'ENTERED'
                };
            case 'completed':
                return {
                    accent: 'bg-slate-500',
                    border: 'hover:border-slate-500/50',
                    text: 'ENDED'
                };
            default:
                return {
                    accent: 'bg-primary',
                    border: 'hover:border-primary/50',
                    text: 'OPEN'
                };
        }
    };

    const theme = getTheme();

    const handleClick = () => {
        const path = type === 'registered' 
            ? `/tournaments/${tournament._id}/hub` 
            : `/tournaments/${tournament._id}`;
        navigate(path);
    };

    return (
        <div 
            onClick={handleClick}
            className={`
                group relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer
                bg-card border border-border/50
                transition-all duration-300 ease-out
                ${theme.border} hover:-translate-y-1 hover:shadow-xl
                pb-16 md:pb-0
            `}
        >
            <div className="relative h-40 w-full overflow-hidden bg-muted/20">
                {tournament.banner ? (
                    <img 
                        src={tournament.banner as string} 
                        alt={tournament.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 
                                 opacity-40 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
                    />
                ) : (
                    <div className={`absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-${theme.accent.replace('bg-', '')} to-transparent`} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

                <div className="absolute top-3 right-3 z-10">
                    <span className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-white uppercase shadow-sm
                        backdrop-blur-md bg-opacity-80
                        ${theme.accent} 
                        ${type === 'ongoing' ? 'animate-pulse' : ''}
                    `}>
                        {type === 'ongoing' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                        {theme.text}
                    </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 z-10">
                    <div className="flex items-center gap-2 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                            {tournament.sport || "Tournament"}
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-foreground leading-tight line-clamp-2 drop-shadow-md">
                        {tournament.title}
                    </h3>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4 bg-card relative z-20">
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                            <Calendar size={10} /> Date
                        </span>
                        <span className="text-sm font-semibold text-foreground">{dateStr}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                            <Users size={10} /> Teams
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                            {tournament.teams?.length || 0} / {tournament.maxTeams || '-'}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <MapPin size={14} className="text-primary/70" />
                        <span className="truncate max-w-[140px]">{tournament.location}</span>
                    </div>

                    <div className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                        ${type === 'registered' 
                            ? 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white' 
                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'}
                    `}>
                        <span>{type === 'registered' ? 'Hub' : 'View'}</span>
                        <ArrowUpRight size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
};