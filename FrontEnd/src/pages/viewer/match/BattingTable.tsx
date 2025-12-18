import { User } from "lucide-react"; // Using Lucide Icons
import type { BattingStats } from "../../../features/manager/Matches/matchTypes";

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
        <div className="w-full">
            {/* Table Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <User size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Batting Scorecard</h3>
                        <p className="text-xs text-neutral-500">{teamName} • {formatBallsToOvers(balls)} overs</p>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-500 uppercase bg-black/20 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-bold tracking-wider">Batter</th>
                            <th className="px-4 py-4 text-right">R</th>
                            <th className="px-4 py-4 text-right">B</th>
                            <th className="px-4 py-4 text-right hidden sm:table-cell">4s</th>
                            <th className="px-4 py-4 text-right hidden sm:table-cell">6s</th>
                            <th className="px-4 py-4 text-right text-neutral-400">SR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {safeStats.map((batsman) => {
                            const isNotOut = !batsman.out;
                            return (
                                <tr 
                                    key={batsman.playerId} 
                                    className={`transition-colors hover:bg-white/[0.02] ${isNotOut ? 'bg-green-500/5' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-8 rounded-full ${isNotOut ? 'bg-green-500' : 'bg-neutral-700'}`} />
                                            <div>
                                                <div className="font-bold text-white flex items-center gap-2">
                                                    {getPlayerName(batsman.playerId)}
                                                    {isNotOut && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">NOT OUT</span>}
                                                </div>
                                                <div className="text-xs text-neutral-500 font-medium mt-0.5">
                                                    {getPlayerRole(batsman.playerId)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-white text-base">
                                        {batsman.runs}
                                    </td>
                                    <td className="px-4 py-4 text-right text-neutral-400">
                                        {batsman.balls}
                                    </td>
                                    <td className="px-4 py-4 text-right text-neutral-500 hidden sm:table-cell">
                                        {batsman.fours}
                                    </td>
                                    <td className="px-4 py-4 text-right text-neutral-500 hidden sm:table-cell">
                                        {batsman.sixes}
                                    </td>
                                    <td className="px-4 py-4 text-right font-mono text-neutral-300">
                                        {batsman.strikeRate}
                                    </td>
                                </tr>
                            );
                        })}
                        {safeStats.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 italic">
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