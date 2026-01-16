import { Shield } from 'lucide-react';
import { type Tournament } from '../../../../features/manager/managerTypes'; 

interface TeamsTabProps {
    tournament: Tournament;
}

const TeamsTab = ({ tournament }: TeamsTabProps) => {
    const fillPercentage = Math.min((tournament.currTeams / tournament.maxTeams) * 100, 100);

    return (
        <div className="animate-in fade-in duration-300">
            <div className="border border-border rounded-2xl p-8 md:p-12 text-center bg-card">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Bracket Hidden</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Participating teams and the tournament bracket will be revealed after registration closes.
                </p>
                <div className="max-w-sm mx-auto bg-muted/50 rounded-xl p-4">
                    <div className="flex justify-between text-xs font-semibold uppercase text-muted-foreground mb-3">
                        <span>Registration Progress</span>
                        <span>{tournament.currTeams}/{tournament.maxTeams} Teams</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${fillPercentage}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamsTab;