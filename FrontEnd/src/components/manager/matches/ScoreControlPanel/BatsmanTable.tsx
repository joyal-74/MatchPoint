import React from 'react';
import type { BatsmanStats } from './MatchTypes';

interface BatsmanTableProps {
    batsmen: BatsmanStats[];
}

const BatsmanTable: React.FC<BatsmanTableProps> = ({ batsmen }) => {
    if (batsmen.length === 0) {
        return <div className="bg-neutral-800 p-4 rounded-xl text-neutral-400">No batsmen information available for this innings.</div>;
    }

    // Filter for current (undismissed) and dismissed batsmen
    const currentBatsmen = batsmen.filter(b => b.outDescription === null);
    const dismissedBatsmen = batsmen.filter(b => b.outDescription !== null);

    const calculateStrikeRate = (runs: number, balls: number): string => {
        if (balls === 0) return '0.00';
        return ((runs / balls) * 100).toFixed(2);
    };

    const renderBatsmen = (list: BatsmanStats[], isCurrent: boolean = false) => (
        list.map((batsman) => (
            <tr
                key={batsman.id}
                className={`hover:bg-neutral-700 transition duration-150 ${isCurrent ? 'font-bold text-lg text-white' : 'text-neutral-200'}`}
            >
                <td className="py-2 px-4">
                    {batsman.name}
                    {isCurrent && batsman.isStriker && <span className="text-indigo-400 text-xs ml-2">(Striker)</span>}
                    {isCurrent && !batsman.isStriker && <span className="text-neutral-400 text-xs ml-2">(Non-Striker)</span>}
                </td>
                <td className="py-2 px-4 text-sm text-neutral-400">
                    {batsman.outDescription ? batsman.outDescription : (isCurrent ? 'Batting' : 'Yet to bat')}
                </td>
                <td className="py-2 px-4">{batsman.runs}</td>
                <td className="py-2 px-4">{batsman.balls}</td>
                <td className="py-2 px-4">{batsman.fours}</td>
                <td className="py-2 px-4">{batsman.sixes}</td>
                <td className="py-2 px-4">{calculateStrikeRate(batsman.runs, batsman.balls)}</td>
            </tr>
        ))
    );

    return (
        <div className="bg-neutral-800 p-6 rounded-xl shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-neutral-200">Batsmen Performance</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-700 text-neutral-400 uppercase text-xs tracking-wider">
                            <th className="py-3 px-4 w-1/4">Player</th>
                            <th className="py-3 px-4 w-1/4">Status</th>
                            <th className="py-3 px-4">R</th>
                            <th className="py-3 px-4">B</th>
                            <th className="py-3 px-4">4s</th>
                            <th className="py-3 px-4">6s</th>
                            <th className="py-3 px-4">SR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Current/Active Batsmen */}
                        {renderBatsmen(currentBatsmen, true)}
                        {/* Dismissed Batsmen (if any) */}
                        {dismissedBatsmen.length > 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-2 bg-neutral-700 text-sm font-medium text-indigo-300">
                                    Dismissed
                                </td>
                            </tr>
                        )}
                        {renderBatsmen(dismissedBatsmen, false)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BatsmanTable;