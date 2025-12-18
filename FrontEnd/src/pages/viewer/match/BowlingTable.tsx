import { CircleDot } from "lucide-react"; // Using Lucide Icons
import type { BowlingStats } from "../../../features/manager/Matches/matchTypes";

interface BowlingTableProps {
    stats: BowlingStats[];
    currentBowlerId: string | null | undefined;
    teamName: string;
    getPlayerName: (id: string) => string;
}

export const BowlingTable = ({ stats, currentBowlerId, teamName, getPlayerName }: BowlingTableProps) => {
    return (
        <div className="w-full">
            {/* Table Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <CircleDot size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Bowling Card</h3>
                        <p className="text-xs text-neutral-500">{teamName} Attack</p>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-neutral-500 uppercase bg-black/20 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-bold tracking-wider">Bowler</th>
                            <th className="px-4 py-4 text-right">O</th>
                            <th className="px-4 py-4 text-right hidden sm:table-cell">M</th>
                            <th className="px-4 py-4 text-right">R</th>
                            <th className="px-4 py-4 text-right">W</th>
                            <th className="px-4 py-4 text-right text-neutral-400">Econ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {stats.map((bowler, index) => {
                            const isCurrent = bowler.playerId === currentBowlerId;
                            return (
                                <tr 
                                    key={index} 
                                    className={`transition-colors hover:bg-white/[0.02] ${isCurrent ? 'bg-emerald-500/5' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Status Indicator */}
                                            {isCurrent ? (
                                                <div className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </div>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-neutral-700" />
                                            )}
                                            
                                            <span className={`font-medium ${isCurrent ? 'text-white' : 'text-neutral-300'}`}>
                                                {getPlayerName(bowler.playerId)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium text-white">
                                        {bowler.overs}
                                    </td>
                                    <td className="px-4 py-4 text-right text-neutral-500 hidden sm:table-cell">
                                        0 {/* M values aren't in your types yet, placeholder */}
                                    </td>
                                    <td className="px-4 py-4 text-right text-neutral-300">
                                        {bowler.runsConceded}
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-white">
                                        {bowler.wickets}
                                    </td>
                                    <td className="px-4 py-4 text-right font-mono text-neutral-400">
                                        {bowler.economy}
                                    </td>
                                </tr>
                            );
                        })}
                        {stats.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 italic">
                                    No bowling data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};