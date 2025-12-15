import React, { useState } from 'react';
import type { InningsDetails, BatsmanStats, BowlerStats, MatchState } from './MatchTypes';

// --- Updated Styles ---
const TAB_BASE_STYLE = "px-4 py-2 font-medium text-sm transition-colors rounded-t-lg";
const TAB_ACTIVE_STYLE = "bg-neutral-800 text-indigo-300 border-t border-l border-r border-neutral-600";
const TAB_INACTIVE_STYLE = "text-neutral-400 hover:text-indigo-200 hover:bg-neutral-800/50";

const VIEW_TAB_BASE = "px-3 py-1.5 text-xs font-medium rounded-md transition-colors";
const VIEW_TAB_ACTIVE = "bg-neutral-700 text-white";
const VIEW_TAB_INACTIVE = "text-neutral-400 hover:text-white hover:bg-neutral-700/50";

interface InningsScoreProps {
    innings: InningsDetails;
    inningsNumber: 1 | 2;
}

const InningsScore: React.FC<InningsScoreProps> = ({ innings, inningsNumber }) => {
    const [activeView, setActiveView] = useState<'batting' | 'bowling'>('batting');

    const calculateStrikeRate = (runs: number, balls: number): string => {
        if (balls === 0) return '0.00';
        return ((runs / balls) * 100).toFixed(2);
    };
    
    const renderBattingTable = (batsmen: BatsmanStats[]) => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-neutral-700 text-xs text-neutral-400">
                        <th className="py-2 px-3 text-left font-medium w-1/3">Batter</th>
                        <th className="py-2 px-2 text-left font-medium min-w-32">Status</th>
                        <th className="py-2 px-2 text-left font-medium">R</th>
                        <th className="py-2 px-2 text-left font-medium">B</th>
                        <th className="py-2 px-2 text-left font-medium">SR</th>
                    </tr>
                </thead>
                <tbody>
                    {batsmen.map((b: BatsmanStats) => (
                        <tr key={b.id} className="border-b border-neutral-800/50 text-sm hover:bg-neutral-800/30">
                            <td className="py-2 px-3 font-medium">{b.name}</td>
                            <td className="py-2 px-2 text-xs text-neutral-300 truncate max-w-[160px]">
                                {b.outDescription || 'Did not bat'}
                            </td>
                            <td className="py-2 px-2 font-medium">{b.runs}</td>
                            <td className="py-2 px-2 text-neutral-300">{b.balls}</td>
                            <td className="py-2 px-2">{calculateStrikeRate(b.runs, b.balls)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderBowlingTable = (bowlers: BowlerStats[]) => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-neutral-700 text-xs text-neutral-400">
                        <th className="py-2 px-3 text-left font-medium w-1/3">Bowler</th>
                        <th className="py-2 px-2 text-left font-medium">O</th>
                        <th className="py-2 px-2 text-left font-medium">M</th>
                        <th className="py-2 px-2 text-left font-medium">R</th>
                        <th className="py-2 px-2 text-left font-medium">W</th>
                        <th className="py-2 px-2 text-left font-medium">Eco</th>
                    </tr>
                </thead>
                <tbody>
                    {bowlers.map((b: BowlerStats) => (
                        <tr key={b.id} className="border-b border-neutral-800/50 text-sm hover:bg-neutral-800/30">
                            <td className="py-2 px-3 font-medium">{b.name}</td>
                            <td className="py-2 px-2">{b.overs.toFixed(1)}</td>
                            <td className="py-2 px-2 text-neutral-300">{b.maidens}</td>
                            <td className="py-2 px-2">{b.runsConceded}</td>
                            <td className="py-2 px-2 font-bold text-red-400">{b.wickets}</td>
                            <td className="py-2 px-2">
                                {b.overs > 0 ? (b.runsConceded / b.overs).toFixed(2) : '0.00'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="bg-neutral-800/50 rounded-lg p-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                    {innings.name} - {innings.totalRuns}/{innings.wickets}
                </h3>
                <p className="text-sm text-neutral-400">
                    {innings.overs.toFixed(1)} overs • Innings {inningsNumber}
                </p>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 mb-4">
                <button
                    onClick={() => setActiveView('batting')}
                    className={`${VIEW_TAB_BASE} ${activeView === 'batting' ? VIEW_TAB_ACTIVE : VIEW_TAB_INACTIVE}`}
                >
                    Batting
                </button>
                <button
                    onClick={() => setActiveView('bowling')}
                    className={`${VIEW_TAB_BASE} ${activeView === 'bowling' ? VIEW_TAB_ACTIVE : VIEW_TAB_INACTIVE}`}
                >
                    Bowling
                </button>
            </div>
            
            {/* Content */}
            {activeView === 'batting' 
                ? renderBattingTable(innings.batsmenScore) 
                : renderBowlingTable(innings.bowlersScore)
            }

            {/* Extras */}
            <div className="mt-4 pt-3 border-t border-neutral-700">
                <p className="text-xs text-neutral-400">
                    Extras: {innings.extras.wides + innings.extras.noBalls + innings.extras.byes + innings.extras.legByes} 
                    <span className="text-neutral-500 ml-2">
                        (w{innings.extras.wides}, nb{innings.extras.noBalls}, b{innings.extras.byes}, lb{innings.extras.legByes})
                    </span>
                </p>
            </div>
        </div>
    );
};

const FullScorecard: React.FC<{ matchState: MatchState }> = ({ matchState }) => {
    const inningsAvailable = [
        matchState.innings1 ? 1 : null,
        matchState.innings2 ? 2 : null,
    ].filter((n): n is 1 | 2 => n !== null);

    const [activeInnings, setActiveInnings] = useState<1 | 2>(inningsAvailable.length > 0 ? inningsAvailable[0] : 1);

    if (inningsAvailable.length === 0) {
        return (
            <div className="bg-neutral-800/50 p-6 rounded-lg text-center">
                <p className="text-neutral-400">No innings data available yet</p>
            </div>
        );
    }

    const currentInningsData = activeInnings === 1 ? matchState.innings1 : matchState.innings2;

    return (
        <div className="bg-neutral-900 p-5 rounded-xl">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-white mb-2">Match Scorecard</h2>
                
                {matchState.matchResult && (
                    <div className="inline-block px-3 py-1.5 bg-green-900/30 border border-green-800/50 rounded-md text-green-300 text-sm font-medium mb-4">
                        {matchState.matchResult}
                    </div>
                )}
            </div>
            
            {/* Innings Tabs */}
            <div className="flex gap-1 mb-5">
                {inningsAvailable.includes(1) && matchState.innings1 && (
                    <button
                        onClick={() => setActiveInnings(1)}
                        className={`${TAB_BASE_STYLE} ${activeInnings === 1 ? TAB_ACTIVE_STYLE : TAB_INACTIVE_STYLE}`}
                    >
                        {matchState.innings1.name}
                    </button>
                )}
                {inningsAvailable.includes(2) && matchState.innings2 && (
                    <button
                        onClick={() => setActiveInnings(2)}
                        className={`${TAB_BASE_STYLE} ${activeInnings === 2 ? TAB_ACTIVE_STYLE : TAB_INACTIVE_STYLE}`}
                    >
                        {matchState.innings2.name}
                    </button>
                )}
            </div>

            {/* Innings Content */}
            {currentInningsData && (
                <InningsScore 
                    innings={currentInningsData} 
                    inningsNumber={activeInnings} 
                />
            )}
        </div>
    );
};

export default FullScorecard;