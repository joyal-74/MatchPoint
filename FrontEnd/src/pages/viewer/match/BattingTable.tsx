import { FaUserFriends } from "react-icons/fa";
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

    // Defensive check: Ensure stats is always an array
    const safeStats = Array.isArray(stats) ? stats : [];

    return (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-700 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <FaUserFriends className="text-neutral-400"/>
                    {teamName} Batting 
                </h3>
                <span className="text-sm font-normal text-neutral-400">({formatBallsToOvers(balls)} overs)</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-900">
                        <tr>
                            <th className="text-left p-4 font-medium text-neutral-300">Batter</th>
                            <th className="text-right p-4 font-medium text-neutral-300">R</th>
                            <th className="text-right p-4 font-medium text-neutral-300">B</th>
                            <th className="text-right p-4 font-medium text-neutral-300">4s</th>
                            <th className="text-right p-4 font-medium text-neutral-300">6s</th>
                            <th className="text-right p-4 font-medium text-neutral-300">SR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                        {safeStats.map((batsman) => (
                            <tr key={batsman.playerId} className={batsman.out ? 'text-neutral-400' : 'bg-green-900/10'}>
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <div>
                                            <span className="font-medium text-white">{getPlayerName(batsman.playerId)}</span>
                                            <div className="text-xs text-neutral-500">{getPlayerRole(batsman.playerId)}</div>
                                        </div>
                                        {!batsman.out && <span className="ml-2 text-green-400 animate-pulse">●</span>}
                                    </div>
                                </td>
                                <td className="text-right p-4 font-bold text-white">{batsman.runs}</td>
                                <td className="text-right p-4">{batsman.balls}</td>
                                <td className="text-right p-4">{batsman.fours}</td>
                                <td className="text-right p-4">{batsman.sixes}</td>
                                <td className="text-right p-4 text-neutral-400">{batsman.strikeRate}</td>
                            </tr>
                        ))}
                        {safeStats.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-neutral-500">
                                    No batting stats available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};