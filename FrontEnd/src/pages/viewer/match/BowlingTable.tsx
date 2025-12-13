import { FaBaseballBall } from "react-icons/fa";
import type { BowlingStats } from "../../../features/manager/Matches/matchTypes";

interface BowlingTableProps {
    stats: BowlingStats[];
    currentBowlerId: string | null | undefined;
    teamName: string;
    getPlayerName: (id: string) => string;
}

export const BowlingTable = ({ stats, currentBowlerId, teamName, getPlayerName }: BowlingTableProps) => {
    return (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-700">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <FaBaseballBall className="text-neutral-400"/>
                    {teamName} Bowling
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-900">
                        <tr>
                            <th className="text-left p-4 text-neutral-300">Bowler</th>
                            <th className="text-right p-4 text-neutral-300">O</th>
                            <th className="text-right p-4 text-neutral-300">M</th>
                            <th className="text-right p-4 text-neutral-300">R</th>
                            <th className="text-right p-4 text-neutral-300">W</th>
                            <th className="text-right p-4 text-neutral-300">Econ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                        {stats.map((bowler, index) => {
                            const isCurrent = bowler.playerId === currentBowlerId;
                            return (
                                <tr key={index} className={isCurrent ? 'bg-yellow-900/10' : ''}>
                                    <td className="p-4 font-medium text-white">
                                        {getPlayerName(bowler.playerId)}
                                        {isCurrent && <span className="ml-2 text-yellow-500">●</span>}
                                    </td>
                                    <td className="text-right p-4 text-white">{bowler.overs}</td>
                                    <td className="text-right p-4 text-neutral-400">0</td>
                                    <td className="text-right p-4 text-white">{bowler.runsConceded}</td>
                                    <td className="text-right p-4 font-bold text-white">{bowler.wickets}</td>
                                    <td className="text-right p-4 text-neutral-400">{bowler.economy}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};