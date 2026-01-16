import { CheckCircle2, Info } from 'lucide-react';
import { type Tournament } from '../../../features/manager/managerTypes'; 

interface TournamentSidebarProps {
    tournament: Tournament;
}

const TournamentSidebar = ({ tournament }: TournamentSidebarProps) => {
    const slotsLeft = tournament.maxTeams - tournament.currTeams;

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-6">Tournament Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground text-sm">Status</span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Active</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground text-sm">Slots Available</span>
                            <span className="font-medium">{slotsLeft}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground text-sm">Min Teams</span>
                            <span className="font-medium">{tournament.minTeams}</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        <button className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2">
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
        </div>
    );
};

export default TournamentSidebar;