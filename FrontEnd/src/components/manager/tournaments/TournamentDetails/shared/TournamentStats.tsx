interface TournamentStatsProps {
    tournamentData: {
        currTeams: number;
        maxTeams: number;
    };
}

export default function TournamentStats({ tournamentData }: TournamentStatsProps) {
    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
            <h3 className="text-lg font-semibold mb-3">Tournament Stats</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Registration Progress</span>
                    <span className="font-medium">
                        {tournamentData.currTeams}/{tournamentData.maxTeams}
                    </span>
                </div>
                <div className="w-full bg-neutral-700/50 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                        style={{
                            width: `${(tournamentData.currTeams / tournamentData.maxTeams) * 100}%`,
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 text-center">
                    <div className="bg-neutral-700/30 rounded-xl p-3">
                        <div className="text-2xl font-bold text-green-400">
                            {tournamentData.currTeams}
                        </div>
                        <div className="text-xs text-neutral-400">Teams</div>
                    </div>
                </div>
            </div>
        </div>
    );
}