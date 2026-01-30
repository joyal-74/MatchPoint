import { User, Activity } from "lucide-react";
import type { BattingStats } from "../../../domain/match/types";

interface BattingTableProps {
    stats: BattingStats[];
    teamName: string;
    balls: number;
    getPlayerName: (id: string) => string;
    getPlayerRole: (id: string) => string;
}

export const BattingTable = ({ stats, teamName, balls, getPlayerName, getPlayerRole }: BattingTableProps) => {
    
    const formatBallsToOvers = (b: number) => {
        const overs = Math.floor(b / 6);
        const rem = b % 6;
        return rem > 0 ? `${overs}.${rem}` : `${overs}`;
    };

    const safeStats = Array.isArray(stats) ? stats : [];

    return (
        <div className="w-full flex flex-col h-full">
            {/* Table Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <User size={18} className="text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Batting Scorecard</h3>
                        <p className="text-xs text-muted-foreground">{teamName} • {formatBallsToOvers(balls)} overs</p>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/10 border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-semibold tracking-wider">Batter</th>
                            <th className="px-4 py-3 text-right font-semibold">R</th>
                            <th className="px-4 py-3 text-right font-semibold">B</th>
                            <th className="px-4 py-3 text-right font-semibold hidden sm:table-cell">4s</th>
                            <th className="px-4 py-3 text-right font-semibold hidden sm:table-cell">6s</th>
                            <th className="px-4 py-3 text-right font-semibold text-muted-foreground">SR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {safeStats.map((batsman) => {
                            const isNotOut = !batsman.out;
                            return (
                                <tr 
                                    key={batsman.playerId} 
                                    className={`transition-colors hover:bg-muted/30 ${isNotOut ? 'bg-primary/5' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Status Indicator */}
                                            <div className={`w-1 h-8 rounded-full ${isNotOut ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                            
                                            <div>
                                                <div className="font-medium text-foreground flex items-center gap-2">
                                                    {getPlayerName(batsman.playerId)}
                                                    {isNotOut && (
                                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 font-bold uppercase tracking-wider flex items-center gap-1">
                                                            <Activity size={8} className="animate-pulse" /> Not Out
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground font-medium mt-0.5">
                                                    {getPlayerRole(batsman.playerId)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-foreground text-base">
                                        {batsman.runs}
                                    </td>
                                    <td className="px-4 py-4 text-right text-muted-foreground font-medium">
                                        {batsman.balls}
                                    </td>
                                    <td className="px-4 py-4 text-right text-muted-foreground hidden sm:table-cell">
                                        {batsman.fours}
                                    </td>
                                    <td className="px-4 py-4 text-right text-muted-foreground hidden sm:table-cell">
                                        {batsman.sixes}
                                    </td>
                                    <td className="px-4 py-4 text-right font-mono text-muted-foreground">
                                        {batsman.strikeRate}
                                    </td>
                                </tr>
                            );
                        })}
                        {safeStats.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                                    Innings has not started yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};