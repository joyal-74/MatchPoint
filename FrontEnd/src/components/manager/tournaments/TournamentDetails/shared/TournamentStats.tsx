interface TournamentStatsProps {
    tournamentData: {
        currTeams: number;
        maxTeams: number;
    };
}

export default function TournamentStats({ tournamentData }: TournamentStatsProps) {
    return (
        <div className="bg-card/50 rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Tournament Stats</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Registration Progress</span>
                    <span className="font-medium text-foreground">
                        {tournamentData.currTeams}/{tournamentData.maxTeams}
                    </span>
                </div>
                
                {/* Progress Bar Track */}
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    {/* Progress Bar Fill - Uses Primary Color */}
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${(tournamentData.currTeams / tournamentData.maxTeams) * 100}%`,
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 text-center">
                    <div className="bg-muted/50 rounded-xl p-3 border border-border/50">
                        <div className="text-2xl font-bold text-primary">
                            {tournamentData.currTeams}
                        </div>
                        <div className="text-xs text-muted-foreground">Teams Registered</div>
                    </div>
                </div>
            </div>
        </div>
    );
}