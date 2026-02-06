import React from "react";
import { Calendar, Users, Trophy, MapPin, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tournament } from "../../features/player/Tournnaments/tournamentType";


interface TournamentCardProps {
    tournament: Tournament;
    isHistory?: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
    tournament,
    isHistory = false
}) => {
    const navigate = useNavigate();

    // Helper to format date cleanly
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    console.log(tournament)

    return (
        <div
            onClick={() => navigate(`/player/tournaments/${tournament._id}`)}
            className="group relative flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer"
        >
            {/* 1. Image Banner Area */}
            <div className="relative h-48 bg-muted overflow-hidden">
                {tournament.banner ? (
                    <img
                        src={tournament.banner as string}
                        alt={tournament.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                        <Trophy className="text-muted-foreground/30 w-16 h-16" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`
            px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md shadow-sm border
            ${isHistory
                            ? "bg-slate-100/90 text-slate-700 border-slate-200"
                            : "bg-green-100/90 text-green-700 border-green-200"
                        }
          `}>
                        {isHistory ? "Completed" : "Registered"}
                    </span>
                </div>
            </div>

            {/* 2. Content Area */}
            <div className="flex flex-col flex-grow p-5">
                <h3 className="text-lg font-bold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {tournament.title}
                </h3>

                <div className="space-y-2.5 mt-2 mb-4">
                    {/* Date */}
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={16} className="mr-2 text-primary/70" />
                        <span>{formatDate(tournament.startDate)}</span>
                    </div>

                    {/* Team Count */}
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users size={16} className="mr-2 text-primary/70" />
                        <span>{tournament.currTeams} / {tournament.maxTeams} Teams</span>
                    </div>

                    {/* Location (Optional) */}
                    {tournament.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin size={16} className="mr-2 text-primary/70" />
                            <span className="truncate max-w-[150px] sm:max-w-[200px]">
                                {tournament.location}
                            </span>
                        </div>
                    )}
                </div>

                {/* 3. Footer / Action Area */}
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm">
                    {isHistory ? (
                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                            <Trophy size={14} /> View Results
                        </span>
                    ) : (
                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                            <Clock size={14} /> Starts soon
                        </span>
                    )}

                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transform group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};