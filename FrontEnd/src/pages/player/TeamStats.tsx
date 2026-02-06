const TeamStats = ({ team }: { team: any }) => (
    <div className="space-y-4">
        <div>
            <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-muted-foreground font-medium">Win Rate</span>
                <span className="font-bold">{team.stats.winRate}%</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${team.stats.winRate}%` }} />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
            <div>
                <p className="text-[9px] text-muted-foreground uppercase">Matches</p>
                <p className="text-sm font-bold">{team.stats.totalMatches}</p>
            </div>
            <div>
                <p className="text-[9px] text-muted-foreground uppercase">Rank</p>
                <p className="text-sm font-bold">#4</p>
            </div>
        </div>
    </div>
);

export default TeamStats;