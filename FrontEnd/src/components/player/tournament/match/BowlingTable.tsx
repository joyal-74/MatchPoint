import { CircleDot, Activity } from "lucide-react";
import type { BowlingStats } from "../../../features/manager/Matches/matchTypes";

interface BowlingTableProps {
    stats: BowlingStats[];
    currentBowlerId: string | null | undefined;
    teamName: string;
    getPlayerName: (id: string) => string;
}

export const BowlingTable = ({ stats, currentBowlerId, teamName, getPlayerName }: BowlingTableProps) => {
    return (
        <div className="w-full flex flex-col h-full">
            {/* Table Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <CircleDot size={18} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Bowling Card</h3>
                        <p className="text-xs text-muted-foreground">{teamName}</p>
                    </div>
                </div>
                {/* Optional: Add active indicator if current bowler exists */}
                {currentBowlerId && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Activity size={12} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Active</span>
                    </div>
                )}
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/10 border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-semibold tracking-wider">Bowler</th>
                            <th className="px-4 py-3 text-right font-semibold">O</th>
                            <th className="px-4 py-3 text-right font-semibold hidden sm:table-cell">M</th>
                            <th className="px-4 py-3 text-right font-semibold">R</th>
                            <th className="px-4 py-3 text-right font-semibold">W</th>
                            <th className="px-4 py-3 text-right font-semibold">Econ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {stats.map((bowler, index) => {
                            const isCurrent = bowler.playerId === currentBowlerId;
                            return (
                                <tr 
                                    key={index} 
                                    className={`transition-colors hover:bg-muted/30 ${isCurrent ? 'bg-primary/5' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Status Indicator */}
                                            {isCurrent ? (
                                                <div className="relative flex h-2 w-2 shrink-0">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                                </div>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
                                            )}
                                            
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                                                    {getPlayerName(bowler.playerId)}
                                                </span>
                                                {isCurrent && <span className="text-[10px] text-muted-foreground sm:hidden">Bowling</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium text-foreground">
                                        {bowler.overs}
                                    </td>
                                    <td className="px-4 py-4 text-right text-muted-foreground hidden sm:table-cell">
                                        0 {/* M values aren't in type yet */}
                                    </td>
                                    <td className="px-4 py-4 text-right text-muted-foreground">
                                        {bowler.runsConceded}
                                    </td>
                                    <td className={`px-4 py-4 text-right font-bold ${bowler.wickets > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {bowler.wickets}
                                    </td>
                                    <td className="px-4 py-4 text-right font-mono text-muted-foreground">
                                        {bowler.economy}
                                    </td>
                                </tr>
                            );
                        })}
                        {stats.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                                    No bowling data available yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};