import React, { useState } from 'react';
import type { Match, LiveScoreState, Team } from '../../../features/manager/Matches/matchTypes';

interface FullScoreboardTabsProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
}

const FullScoreboardTabs: React.FC<FullScoreboardTabsProps> = ({ match, teamA, teamB, liveScore }) => {
    const [activeInnings, setActiveInnings] = useState<1 | 2>(1);
    const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'extras'>('batting');

    if (!liveScore) {
        return (
            <div className="bg-gray-900 p-6 rounded-xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-800 rounded"></div>
                        <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    const inningsData = activeInnings === 1 ? liveScore.innings1 : (liveScore.innings2 || liveScore.innings1);
    if (!inningsData) return <div className="text-gray-400 p-4">Innings data not available</div>;

    const battingTeam = match.teamA._id === inningsData.battingTeamId ? teamA : teamB;
    const bowlingTeam = match.teamA._id === inningsData.bowlingTeamId ? teamA : teamB;

    const getPlayerName = (playerId: string): string => {
        const player = [...teamA.members, ...teamB.members].find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const getStrikeRate = (runs: number, balls: number): string => {
        if (balls === 0) return '0.00';
        return ((runs / balls) * 100).toFixed(2);
    };

    const getEconomy = (runs: number, overs: number): string => {
        if (overs === 0) return '0.00';
        return (runs / overs).toFixed(2);
    };

    const renderBattingScorecard = () => {
        const battingStats = Object.entries(inningsData.battingStats);

        return (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-800 border-b border-gray-700">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Batter</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">R</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">B</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">4s</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">6s</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">SR</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Dismissal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {battingStats.map(([playerId, stat], index) => (
                            <tr
                                key={playerId}
                                className={`border-b border-gray-800 hover:bg-gray-800/50 ${playerId === inningsData.currentBatsmanId ||
                                        playerId === inningsData.nonStrikerId ? 'bg-green-900/10' : ''
                                    }`}
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <span className="text-gray-400 text-sm mr-2">{index + 1}.</span>
                                        <div>
                                            <div className="font-medium text-white">
                                                {getPlayerName(playerId)}
                                                {(playerId === inningsData.currentBatsmanId) && (
                                                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">★</span>
                                                )}
                                                {(playerId === inningsData.nonStrikerId) && (
                                                    <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">N/S</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-white">{stat.runs}</td>
                                <td className="py-3 px-4 text-right text-gray-300">{stat.balls}</td>
                                <td className="py-3 px-4 text-right text-gray-300">{stat.fours}</td>
                                <td className="py-3 px-4 text-right text-gray-300">{stat.sixes}</td>
                                <td className="py-3 px-4 text-right font-medium text-gray-300">
                                    {getStrikeRate(stat.runs, stat.balls)}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`text-sm ${stat.dismissal ? 'text-red-400' : 'text-green-400'
                                        }`}>
                                        {stat.dismissal || (stat.balls > 0 ? 'not out' : '')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderBowlingScorecard = () => {
        const bowlingStats = Object.entries(inningsData.bowlingStats);

        return (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-800 border-b border-gray-700">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Bowler</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">O</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">M</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">R</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">W</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">WD</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">NB</th>
                            <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">ECO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bowlingStats.map(([playerId, stat]) => (
                            <tr
                                key={playerId}
                                className={`border-b border-gray-800 hover:bg-gray-800/50 ${playerId === inningsData.currentBowlerId ? 'bg-red-900/10' : ''
                                    }`}
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="font-medium text-white">
                                                {getPlayerName(playerId)}
                                                {playerId === inningsData.currentBowlerId && (
                                                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">★</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right text-white">{stat.overs.toFixed(1)}</td>
                                <td className="py-3 px-4 text-right text-gray-300">{stat.maidens}</td>
                                <td className="py-3 px-4 text-right text-gray-300">{stat.runsConceded}</td>
                                <td className="py-3 px-4 text-right font-bold text-red-400">{stat.wickets}</td>
                                <td className="py-3 px-4 text-right text-gray-300">{stat.wides || 0}</td>
                                <td className="py-3 px-4 text-right text-gray-300">{stat.noBalls || 0}</td>
                                <td className="py-3 px-4 text-right font-medium text-gray-300">
                                    {getEconomy(stat.runsConceded, stat.overs)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderExtras = () => {
        const extras = inningsData.extras;

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Wides</div>
                    <div className="text-2xl font-bold text-white">{extras?.wides || 0}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">No Balls</div>
                    <div className="text-2xl font-bold text-white">{extras?.noBalls || 0}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Byes</div>
                    <div className="text-2xl font-bold text-white">{extras?.byes || 0}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Leg Byes</div>
                    <div className="text-2xl font-bold text-white">{extras?.legByes || 0}</div>
                </div>
                <div className="col-span-2 md:col-span-4 bg-gray-800/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Total Extras</div>
                    <div className="text-3xl font-bold text-white">
                        {(extras?.wides || 0) + (extras?.noBalls || 0) + (extras?.byes || 0) + (extras?.legByes || 0)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-2">Scoreboard</h2>
                <p className="text-gray-400">
                    {battingTeam.name} vs {bowlingTeam.name}
                </p>
            </div>

            {/* Innings Tabs */}
            <div className="px-6 pt-4">
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setActiveInnings(1)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeInnings === 1
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        1st Innings
                    </button>
                    <button
                        onClick={() => setActiveInnings(2)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeInnings === 2
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        2nd Innings
                    </button>
                </div>
            </div>

            {/* Stats Type Tabs */}
            <div className="px-6 pt-4">
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('batting')}
                        className={`py-3 px-6 font-medium text-sm transition-colors relative ${activeTab === 'batting'
                                ? 'text-green-400 border-b-2 border-green-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Batting
                    </button>
                    <button
                        onClick={() => setActiveTab('bowling')}
                        className={`py-3 px-6 font-medium text-sm transition-colors relative ${activeTab === 'bowling'
                                ? 'text-red-400 border-b-2 border-red-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Bowling
                    </button>
                    <button
                        onClick={() => setActiveTab('extras')}
                        className={`py-3 px-6 font-medium text-sm transition-colors relative ${activeTab === 'extras'
                                ? 'text-yellow-400 border-b-2 border-yellow-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Extras
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'batting' && renderBattingScorecard()}
                {activeTab === 'bowling' && renderBowlingScorecard()}
                {activeTab === 'extras' && renderExtras()}
            </div>
        </div>
    );
};

export default FullScoreboardTabs;