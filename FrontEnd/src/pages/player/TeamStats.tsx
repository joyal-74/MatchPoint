import { Trophy, Calendar, Target } from 'lucide-react';
import type { Team } from '../../features/player/playerTypes';

const TeamStats = ({ team }: { team: Team }) => {
    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Performance
            </h3>
            
            <div className="space-y-4">
                {/* Win Rate Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-foreground">
                            <Target size={16} className="text-primary" /> Win Rate
                        </span>
                        <span className="font-bold text-foreground">{team.stats.winRate}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${team.stats.winRate}%` }} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-muted/40 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                        <Trophy size={20} className="text-yellow-500 mb-1" />
                        <span className="text-xl font-bold text-foreground">{team.stats.totalMatches}</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold">Matches</span>
                    </div>
                    
                    <div className="p-3 bg-muted/40 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                        <Calendar size={20} className="text-green-500 mb-1" />
                        <span className="text-xl font-bold text-foreground">2024</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold">Active Since</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamStats;