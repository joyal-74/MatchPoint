import { MapPin } from 'lucide-react';
import type { Team } from '../../components/player/Teams/Types';

const TeamHeader = ({ team }: { team: Team }) => {
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            
            {/* Cover Banner (could be dynamic later) */}
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />

            <div className="px-6 pb-6 relative">
                {/* Floating Logo */}
                <div className="-mt-12 mb-4 relative inline-block">
                    <img
                        src={team.logo || '/default-team-logo.png'}
                        alt={team.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-lg bg-background"
                    />
                </div>

                {/* Team Info */}
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                            {team.sport}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border 
                            ${team.phase === 'recruiting' 
                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
                                : 'bg-green-500/10 text-green-600 border-green-500/20'
                            }`
                        }>
                            {team.phase}
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-1">{team.name}</h1>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin size={14} className="mr-1.5" />
                        {team.city}, {team.state}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                        {team.description || "No description provided."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TeamHeader;