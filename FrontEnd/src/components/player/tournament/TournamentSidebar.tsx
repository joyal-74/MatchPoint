import { useState } from 'react';
import { CheckCircle2, Info, X, Users } from 'lucide-react';
import { type Tournament } from '../../../features/manager/managerTypes'; 

interface TournamentSidebarProps {
    tournament: Tournament;
}

const TournamentSidebar = ({ tournament }: TournamentSidebarProps) => {
    const [isSquadOpen, setIsSquadOpen] = useState(false);
    const slotsLeft = tournament.maxTeams - tournament.currTeams;


    return (
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-6">Tournament Status</h3>
                    
                    {/* Status Info Rows */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground text-sm">Status</span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Active</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground text-sm">Slots Available</span>
                            <span className="font-medium">{slotsLeft}</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <button 
                            onClick={() => setIsSquadOpen(true)}
                            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            View My Squad
                        </button>
                        
                        <div className="p-3 bg-muted rounded-lg flex gap-3">
                            <Info className="w-5 h-5 text-muted-foreground shrink-0" />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Team registration is managed by <strong>Team Managers</strong> only.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Verified Organizer</span>
                </div>
            </div>

            {/* --- Squad Modal --- */}
            {isSquadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-border">
                            <h2 className="text-xl font-bold">Your Squad</h2>
                            <button 
                                onClick={() => setIsSquadOpen(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-5 bg-muted/30 border-t border-border">
                            <button 
                                onClick={() => setIsSquadOpen(false)}
                                className="w-full py-2.5 text-sm font-semibold bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TournamentSidebar;