// ScoreUpdateControls.tsx
import React, { useState, useMemo } from 'react';
import type { Match, LiveScoreState, Team, InningsState } from '../../../features/manager/Matches/matchTypes';

interface ScoreUpdateControlsProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
    emitScoreUpdate: (payload: any) => void;
}

type InitAction = { type: 'SET_STRIKER' | 'SET_NON_STRIKER' | 'SET_BOWLER' | 'INIT_INNINGS_READY';[k: string]: any };
type BallAction = {
    type: 'RUNS' | 'WICKET';
    runs?: number;
    extra?: 'wide' | 'noBall' | 'legBye' | 'bye' | null;
    dismissalType?: string | null;
    batsmanId?: string | null;
    bowlerId?: string | null;
    newBatsmanId?: string | null;
    fielderId?: string | null;
};

const ScoreUpdateControls: React.FC<ScoreUpdateControlsProps> = ({ match, teamA, teamB, liveScore, emitScoreUpdate }) => {
    const [newBatsmanId, setNewBatsmanId] = useState<string>('');
    const [dismissalType, setDismissalType] = useState<string>('Bowled');
    const [isWicketMode, setIsWicketMode] = useState<boolean>(false);
    const [fielderId, setFielderId] = useState<string>('');

    if (!liveScore) return <div className="text-gray-400">Loading live score...</div>;

    const currentInnings: InningsState | null = liveScore.currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;
    if (!currentInnings) return <div className="text-gray-400">Innings not started</div>;

    const battingTeam = match.teamA._id === currentInnings.battingTeamId ? teamA : teamB;
    const bowlingTeam = match.teamA._id === currentInnings.bowlingTeamId ? teamA : teamB;

    const needsInitialSetup = !currentInnings.currentBatsmanId || !currentInnings.nonStrikerId || !currentInnings.currentBowlerId;

    const allPlayers = useMemo(() => [...battingTeam.members, ...bowlingTeam.members], [battingTeam, bowlingTeam]);

    const getPlayerName = (playerId: string | null): string => {
        if (!playerId) return '—';
        const player = allPlayers.find(p => p._id === playerId);
        return player?.name || 'Unknown';
    };

    const getAvailableBatsmen = () => {
        return battingTeam.members.filter(player => {
            const stats = (currentInnings.battingStats || {})[player._id];
            return !stats || !(stats as any).isOut;
        }).filter(player =>
            player._id !== currentInnings.currentBatsmanId &&
            player._id !== currentInnings.nonStrikerId
        );
    };

    const getFielders = () => {
        return bowlingTeam.members.filter(player => player._id !== currentInnings.currentBowlerId);
    };

    const InitialSetupPanel: React.FC = () => {
        const [striker, setStriker] = useState<string>(currentInnings.currentBatsmanId ?? '');
        const [nonStriker, setNonStriker] = useState<string>(currentInnings.nonStrikerId ?? '');
        const [bowler, setBowler] = useState<string>(currentInnings.currentBowlerId ?? '');

        const startDisabled = !striker || !nonStriker || !bowler || striker === nonStriker;

        return (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Select Opening Players</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-300">Striker</label>
                        <select
                            className="w-full mt-2 bg-gray-800 text-white p-2 rounded-lg"
                            value={striker}
                            onChange={(e) => setStriker(e.target.value)}
                        >
                            <option value="">Select striker...</option>
                            {battingTeam.members.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300">Non-Striker</label>
                        <select
                            className="w-full mt-2 bg-gray-800 text-white p-2 rounded-lg"
                            value={nonStriker}
                            onChange={(e) => setNonStriker(e.target.value)}
                        >
                            <option value="">Select non-striker...</option>
                            {battingTeam.members.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300">Opening Bowler</label>
                        <select
                            className="w-full mt-2 bg-gray-800 text-white p-2 rounded-lg"
                            value={bowler}
                            onChange={(e) => setBowler(e.target.value)}
                        >
                            <option value="">Select bowler...</option>
                            {bowlingTeam.members.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
                        disabled={startDisabled}
                        onClick={() => {
                            emitScoreUpdate({ type: 'SET_STRIKER', batsmanId: striker } as InitAction);
                            emitScoreUpdate({ type: 'SET_NON_STRIKER', batsmanId: nonStriker } as InitAction);
                            emitScoreUpdate({ type: 'SET_BOWLER', bowlerId: bowler } as InitAction);
                            emitScoreUpdate({ type: 'INIT_INNINGS_READY' } as InitAction);
                        }}
                    >
                        Start Innings
                    </button>

                    <button
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg"
                        onClick={() => { setStriker(''); setNonStriker(''); setBowler(''); }}
                    >
                        Reset
                    </button>
                </div>
            </div>
        );
    };

    // ----- Wicket Panel -----
    const WicketPanel: React.FC = () => {
        const availableBatsmen = getAvailableBatsmen();
        const fielders = getFielders();

        return (
            <div className="mb-8 bg-yellow-900/20 border border-yellow-700/30 p-6 rounded-lg">
                <h4 className="text-lg font-bold text-yellow-400 mb-4">Wicket Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Dismissal Type</label>
                        <select value={dismissalType} onChange={(e) => setDismissalType(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                            <option value="Bowled">Bowled</option>
                            <option value="Caught">Caught</option>
                            <option value="LBW">LBW</option>
                            <option value="Run Out">Run Out</option>
                            <option value="Stumped">Stumped</option>
                            <option value="Hit Wicket">Hit Wicket</option>
                            <option value="Obstructing the Field">Obstructing</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">New Batsman</label>
                        <select value={newBatsmanId} onChange={(e) => setNewBatsmanId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                            <option value="">Select batsman...</option>
                            {availableBatsmen.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                {['Caught', 'Run Out', 'Stumped'].includes(dismissalType) && (
                    <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-2">Fielder (if any)</label>
                        <select value={fielderId} onChange={(e) => setFielderId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                            <option value="">Select fielder...</option>
                            {fielders.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (!newBatsmanId) return;
                            emitScoreUpdate({
                                type: "WICKET",
                                dismissalType,
                                nextBatsmanId: newBatsmanId,
                                fielderId: fielderId || null,
                                outBatsmanId: currentInnings.currentBatsmanId
                            });
                            setIsWicketMode(false);
                            setNewBatsmanId('');
                            setFielderId('');
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Confirm Wicket
                    </button>
                    <button
                        onClick={() => { setIsWicketMode(false); setNewBatsmanId(''); setFielderId(''); }}
                        className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    // ----- Run & Extras -----
    const handleRuns = (runs: number) => {
        emitScoreUpdate({
            type: 'RUNS',
            runs,
            extra: null,
            wicket: false,
            batsmanId: currentInnings.currentBatsmanId ?? undefined,
            bowlerId: currentInnings.currentBowlerId ?? undefined,
        } as BallAction);
    };

    const handleDotBall = () => handleRuns(0);

    const handleExtra = (type: 'wide' | 'noBall' | 'bye' | 'legBye') => {
        emitScoreUpdate({
            type: 'RUNS',
            runs: type === 'wide' || type === 'noBall' ? 1 : 0,
            extra: type,
            wicket: false,
            batsmanId: currentInnings.currentBatsmanId ?? undefined,
            bowlerId: currentInnings.currentBowlerId ?? undefined,
        } as BallAction);
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
            {/* Current Players */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Current Players</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-green-400 font-medium mb-1">Striker</div>
                        <div className="text-lg font-bold text-white">{getPlayerName(currentInnings.currentBatsmanId)}</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-400 font-medium mb-1">Non-Striker</div>
                        <div className="text-lg font-bold text-white">{getPlayerName(currentInnings.nonStrikerId)}</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-red-400 font-medium mb-1">Bowler</div>
                        <div className="text-lg font-bold text-white">{getPlayerName(currentInnings.currentBowlerId)}</div>
                    </div>
                </div>
            </div>

            {/* Initial Setup */}
            {needsInitialSetup ? <InitialSetupPanel /> : (
                <>
                    {isWicketMode && <WicketPanel />}
                    {/* Runs */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Runs</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {[0, 1, 2, 3, 4, 6].map(runs => (
                                    <button
                                        key={runs}
                                        onClick={() => runs === 0 ? handleDotBall() : handleRuns(runs)}
                                        className={`py-4 text-lg font-bold rounded-lg transition-all transform hover:scale-105 ${runs === 0 ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                                : runs === 4 ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : runs === 6 ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                    >
                                        {runs}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Extras */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Extras</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <button onClick={() => handleExtra('wide')} className="py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg">Wide (+1)</button>
                                <button onClick={() => handleExtra('noBall')} className="py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg">No Ball (+1)</button>
                                <button onClick={() => handleExtra('bye')} className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg">Bye</button>
                                <button onClick={() => handleExtra('legBye')} className="py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg">Leg Bye</button>
                            </div>
                        </div>

                        {/* Wicket Button */}
                        <div>
                            <button
                                onClick={() => setIsWicketMode(v => !v)}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
                            >
                                {isWicketMode ? 'Cancel Wicket' : 'WICKET'}
                            </button>
                        </div>

                        {/* End Over */}
                        <div>
                            <button
                                onClick={() => emitScoreUpdate({ type: 'END_OVER' })}
                                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg"
                            >
                                End Over & Swap Ends
                            </button>
                        </div>
                    </div>

                    {/* Innings End */}
                    {((currentInnings.wickets >= 10) || (currentInnings.overs >= (match.overs || 50) && currentInnings.ballsInOver >= 6)) && (
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <button
                                onClick={() => emitScoreUpdate({ type: 'END_INNINGS' })}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-lg"
                            >
                                End Innings
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ScoreUpdateControls;
