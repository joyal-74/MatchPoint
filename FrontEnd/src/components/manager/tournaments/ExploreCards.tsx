import React from "react";
import { Calendar, Eye, MapPin, Trophy, UserPlus, Users } from "lucide-react";

interface Tournament {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'upcoming' | 'completed';
    participants: number;
    maxParticipants: number;
    startDate: string;
    location: string;
    prize: string;
    image: string; // Assuming emoji or text for now based on input, but handled as a visual element
    organizer: string;
}

const ExploreCard: React.FC<{ tournament: Tournament }> = ({ tournament }) => {
    
    // Status Badge Logic
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active':
                return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
            case 'upcoming':
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
            case 'completed':
                return "bg-muted text-muted-foreground border-border";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    return (
        <div className="group relative flex flex-col bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
            
            {/* Header Section */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {/* Image/Avatar Container */}
                    <div className="w-12 h-12 flex items-center justify-center text-2xl bg-muted rounded-full border border-border shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {tournament.image}
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                            {tournament.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <span className="font-medium text-foreground/80">{tournament.type}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>{tournament.organizer}</span>
                        </p>
                    </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(tournament.status)}`}>
                    {tournament.status}
                </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary/70" />
                    <span>
                        <span className="text-foreground font-medium">{tournament.participants}</span>
                        <span className="opacity-50">/</span>
                        {tournament.maxParticipants}
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    <span>{tournament.startDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span className="truncate">{tournament.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-foreground font-medium">{tournament.prize}</span>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex space-x-3 mt-auto">
                <button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all font-medium shadow-md shadow-primary/20 active:scale-95">
                    <UserPlus className="w-4 h-4" />
                    <span>Join Now</span>
                </button>
                <button className="px-3 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-xl transition-colors active:scale-95">
                    <Eye className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ExploreCard;