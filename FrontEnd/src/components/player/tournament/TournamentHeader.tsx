import { 
    Calendar, MapPin, Swords, Share2, 
    ChevronLeft, AlertCircle, Check 
} from 'lucide-react';
import type { Tournament } from '../../../features/manager/managerTypes'; 
import { useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

interface TournamentHeaderProps {
    tournament: Tournament;
    navigate: NavigateFunction;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const TournamentHeader = ({ tournament, navigate }: TournamentHeaderProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: tournament.title,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <div className="mb-8">
            <button 
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
            >
                <div className="p-1 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Back to Tournaments</span>
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-[400px] aspect-video rounded-2xl overflow-hidden border border-border shadow-lg shrink-0 relative">
                    <img
                        src={tournament.banner as string}
                        alt={tournament.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 rounded-md text-xs font-bold bg-background/90 backdrop-blur text-foreground border border-border shadow-sm uppercase">
                            {tournament.sport}
                        </span>
                    </div>
                </div>

                <div className="flex-1 space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {tournament.format}
                        </span>
                        {tournament.currTeams >= tournament.maxTeams ? (
                            <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Full
                            </span>
                        ) : (
                            <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Open
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        {tournament.title}
                    </h1>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Swords className="w-4 h-4 text-foreground/70" />
                            <span>Hosted by <strong className="text-foreground">{tournament.organizer || "Admin"}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-foreground/70" />
                            <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-foreground/70" />
                            <span>{tournament.location}</span>
                        </div>
                    </div>
                </div>

                <button onClick={handleShare} className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border hover:bg-muted transition-all relative">
                    <div className={`transition-all duration-300 ${isCopied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} absolute`}>
                        <Share2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className={`transition-all duration-300 ${isCopied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} absolute`}>
                        <Check className="w-5 h-5 text-green-500" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default TournamentHeader;