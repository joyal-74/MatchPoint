// ScoreUpdateControls.tsx (Full, Combined, and Enhanced)
import React, { useState, useMemo } from 'react';
import type { Match, LiveScoreState, Team, InningsState } from '../../../features/manager/Matches/matchTypes';
import { RefreshCw, Zap, Users, Shield, ChevronsRight, Target, XCircle, ArrowUpCircle, RotateCw } from 'lucide-react';

// --- Type Definitions ---
interface ScoreUpdateControlsProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
    emitScoreUpdate: (payload: any) => void;
}

type InitAction = { type: 'SET_STRIKER' | 'SET_NON_STRIKER' | 'SET_BOWLER' | 'INIT_INNINGS_READY'; [k: string]: any };
type BallAction = {
    type: 'RUNS' | 'WICKET';
    runs?: number;
    extra?: 'wide' | 'noBall' | 'legBye' | 'bye' | null;
    dismissalType?: string | null;
    batsmanId?: string | null;
    bowlerId?: string | null;
    newBatsmanId?: string | null;
    fielderId?: string | null;
    outBatsmanId?: string | null; // Added for explicit wicket logic
};
// ----------------------


const ScoreUpdateControls: React.FC<ScoreUpdateControlsProps> = ({ match, teamA, teamB, liveScore, emitScoreUpdate }) => {
    const [newBatsmanId, setNewBatsmanId] = useState<string>('');
    const [dismissalType, setDismissalType] = useState<string>('Caught');
    const [isWicketMode, setIsWicketMode] = useState<boolean>(false);
    const [fielderId, setFielderId] = useState<string>('');
    const [isBowlerSelectionMode, setIsBowlerSelectionMode] = useState<boolean>(false); 

    if (!liveScore) return <div className="p-8 text-center text-xl text-neutral-400">Loading live score...</div>;

    const currentInnings: InningsState | null = liveScore.currentInnings === 1 ? liveScore.innings1 : liveScore.innings2;
    if (!currentInnings) return <div className="p-8 text-center text-xl text-neutral-400">Innings not started</div>;

    const battingTeam = match.teamA._id === currentInnings.battingTeamId ? teamA : teamB;
    const bowlingTeam = match.teamA._id === currentInnings.bowlingTeamId ? teamA : teamB;

    const needsInitialSetup = !currentInnings.currentBatsmanId || !currentInnings.nonStrikerId || !currentInnings.currentBowlerId;
    
    // Logic to determine if a bowler change is mandatory
    const needsBowlerChange = currentInnings.ballsInOver >= 6 && currentInnings.inningsStarted;

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

    // ----- Initial Setup Panel (Enhanced Styling) -----
    const InitialSetupPanel: React.FC = () => {
        const [striker, setStriker] = useState<string>(currentInnings.currentBatsmanId ?? '');
        const [nonStriker, setNonStriker] = useState<string>(currentInnings.nonStrikerId ?? '');
        const [bowler, setBowler] = useState<string>(currentInnings.currentBowlerId ?? '');

        const startDisabled = !striker || !nonStriker || !bowler || striker === nonStriker;

        return (
            <div className="bg-neutral-900/70 backdrop-blur-sm p-8 rounded-2xl border-4 border-dashed border-sky-600/50 shadow-2xl">
                <h3 className="text-2xl font-extrabold text-sky-400 mb-6 flex items-center">
                    <Zap className="mr-3 h-6 w-6" /> Initial Setup: Select Opening Players
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-200 mb-2">🏏 Striker</label>
                        <select
                            className="w-full bg-neutral-800 border border-neutral-600 text-white p-3 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
                            value={striker}
                            onChange={(e) => setStriker(e.target.value)}
                        >
                            <option value="" disabled>Select striker...</option>
                            {battingTeam.members.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-200 mb-2">🚶 Non-Striker</label>
                        <select
                            className="w-full bg-neutral-800 border border-neutral-600 text-white p-3 rounded-xl focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition duration-200"
                            value={nonStriker}
                            onChange={(e) => setNonStriker(e.target.value)}
                        >
                            <option value="" disabled>Select non-striker...</option>
                            {battingTeam.members.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-200 mb-2">🥎 Opening Bowler</label>
                        <select
                            className="w-full bg-neutral-800 border border-neutral-600 text-white p-3 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition duration-200"
                            value={bowler}
                            onChange={(e) => setBowler(e.target.value)}
                        >
                            <option value="" disabled>Select bowler...</option>
                            {bowlingTeam.members.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        className={`flex-1 py-4 text-lg font-extrabold rounded-xl transition-all shadow-lg flex justify-center items-center ${startDisabled
                                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-[1.02]'
                            }`}
                        disabled={startDisabled}
                        onClick={() => {
                            emitScoreUpdate({ type: 'SET_STRIKER', batsmanId: striker } as InitAction);
                            emitScoreUpdate({ type: 'SET_NON_STRIKER', batsmanId: nonStriker } as InitAction);
                            emitScoreUpdate({ type: 'SET_BOWLER', bowlerId: bowler } as InitAction);
                            emitScoreUpdate({ type: 'INIT_INNINGS_READY' } as InitAction);
                        }}
                    >
                        <ChevronsRight className="mr-2 h-5 w-5" /> Start Innings
                    </button>

                    <button
                        className="px-8 py-4 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-bold rounded-xl transition-colors flex items-center"
                        onClick={() => { setStriker(''); setNonStriker(''); setBowler(''); }}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </button>
                </div>
            </div>
        );
    };

    // ----- Wicket Panel (Enhanced Styling) -----
    const WicketPanel: React.FC = () => {
        const availableBatsmen = getAvailableBatsmen();
        const fielders = getFielders();
        const isFielderRequired = ['Caught', 'Run Out', 'Stumped'].includes(dismissalType);
        const isConfirmDisabled = !newBatsmanId || (isFielderRequired && !fielderId && dismissalType !== 'Run Out');

        return (
            <div className="mb-8 bg-red-900/20 border border-red-700/50 p-6 rounded-xl shadow-inner shadow-red-900">
                <h4 className="text-xl font-extrabold text-red-400 mb-5 flex items-center">
                    <XCircle className="mr-2 h-5 w-5" /> Wicket Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">Dismissal Type</label>
                        <select value={dismissalType} onChange={(e) => setDismissalType(e.target.value)}
                            className="w-full bg-neutral-800 border border-red-700/70 rounded-lg px-4 py-2.5 text-white transition duration-200">
                            <option value="Caught">Caught</option>
                            <option value="Bowled">Bowled</option>
                            <option value="LBW">LBW</option>
                            <option value="Run Out">Run Out</option>
                            <option value="Stumped">Stumped</option>
                            <option value="Hit Wicket">Hit Wicket</option>
                            <option value="Obstructing the Field">Obstructing</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">New Batsman</label>
                        <select value={newBatsmanId} onChange={(e) => setNewBatsmanId(e.target.value)}
                            className="w-full bg-neutral-800 border border-red-700/70 rounded-lg px-4 py-2.5 text-white transition duration-200">
                            <option value="" disabled>Select batsman...</option>
                            {availableBatsmen.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                {isFielderRequired && (
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-neutral-300 mb-2">Fielder (if any)</label>
                        <select value={fielderId} onChange={(e) => setFielderId(e.target.value)}
                            className="w-full bg-neutral-800 border border-red-700/70 rounded-lg px-4 py-2.5 text-white transition duration-200">
                            <option value="">Select fielder...</option>
                            {fielders.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            if (isConfirmDisabled) return;

                            emitScoreUpdate({
                                type: "WICKET",
                                dismissalType,
                                newBatsmanId: newBatsmanId,
                                fielderId: fielderId || null,
                                outBatsmanId: currentInnings.currentBatsmanId,
                                runs: 0, 
                                extra: null 
                            } as BallAction);
                            setIsWicketMode(false);
                            setNewBatsmanId('');
                            setFielderId('');
                        }}
                        disabled={isConfirmDisabled}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center ${isConfirmDisabled
                                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white transform hover:scale-[1.02]'
                            }`}
                    >
                        <Shield className="mr-2 h-5 w-5" /> Confirm Wicket
                    </button>
                    <button
                        onClick={() => { setIsWicketMode(false); setNewBatsmanId(''); setFielderId(''); }}
                        className="px-6 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-bold py-3 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };
    
    // ----- Bowler Selection Panel (New Logic) -----
    const BowlerSelectionPanel: React.FC = () => {
        const [nextBowlerId, setNextBowlerId] = useState<string>('');
        
        // Filter out the last bowler who just completed the over
        const availableBowlers = bowlingTeam.members.filter(p => p._id !== currentInnings.currentBowlerId);

        return (
            <div className="bg-sky-900/20 border border-sky-700/50 p-6 rounded-xl mb-8 shadow-inner shadow-sky-900">
                <h4 className="text-xl font-extrabold text-sky-400 mb-5 flex items-center">
                    <RotateCw className="mr-2 h-5 w-5" /> Select Next Bowler
                </h4>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">New Bowler</label>
                    <select 
                        value={nextBowlerId} 
                        onChange={(e) => setNextBowlerId(e.target.value)}
                        className="w-full bg-neutral-800 border border-sky-700/70 rounded-lg px-4 py-2.5 text-white transition duration-200"
                    >
                        <option value="" disabled>Select bowler...</option>
                        {availableBowlers.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                </div>
                
                <button
                    onClick={() => {
                        if (!nextBowlerId) return;
                        // 1. Emit the END_OVER action (handles swapping batsmen)
                        emitScoreUpdate({ type: 'END_OVER' });
                        // 2. Emit the SET_BOWLER action
                        emitScoreUpdate({ type: 'SET_BOWLER', bowlerId: nextBowlerId } as InitAction);
                        setIsBowlerSelectionMode(false);
                    }}
                    disabled={!nextBowlerId}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center 
                        ${!nextBowlerId
                            ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-sky-600 to-cyan-700 hover:from-sky-700 hover:to-cyan-800 text-white transform hover:scale-[1.02]'
                        }`}
                >
                    Confirm Bowler
                </button>
            </div>
        );
    };


    // ----- Run & Extras Handlers -----
    const handleRuns = (runs: number) => {
        emitScoreUpdate({
            type: 'RUNS',
            runs,
            extra: null,
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
            batsmanId: currentInnings.currentBatsmanId ?? undefined,
            bowlerId: currentInnings.currentBowlerId ?? undefined,
        } as BallAction);
    };
    // ---------------------------------

    return (
        <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-700 shadow-2xl">
            {/* Current Players */}
            <div className="mb-10">
                <h3 className="text-xl font-bold text-neutral-300 mb-4 flex items-center"><Users className="mr-2 h-5 w-5" /> Current On-Field Players</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-900/30 border border-green-700/50 p-5 rounded-xl shadow-lg">
                        <div className="text-sm font-medium text-green-400 mb-1">Striker</div>
                        <div className="text-xl font-extrabold text-white">{getPlayerName(currentInnings.currentBatsmanId)}</div>
                    </div>
                    <div className="bg-neutral-800/50 border border-neutral-700/50 p-5 rounded-xl shadow-lg">
                        <div className="text-sm font-medium text-neutral-400 mb-1">Non-Striker</div>
                        <div className="text-xl font-bold text-white">{getPlayerName(currentInnings.nonStrikerId)}</div>
                    </div>
                    <div className="bg-red-900/30 border border-red-700/50 p-5 rounded-xl shadow-lg">
                        <div className="text-sm font-medium text-red-400 mb-1">Bowler</div>
                        <div className="text-xl font-extrabold text-white">{getPlayerName(currentInnings.currentBowlerId)}</div>
                    </div>
                </div>
            </div>

            <hr className="border-neutral-700 mb-8" />

            {/* Main Controls Area */}
            {needsInitialSetup ? (
                <InitialSetupPanel />
            ) : (
                <>
                    {/* Wicket Mode is prioritized above all score recording */}
                    {isWicketMode && <WicketPanel />}
                    
                    {/* Bowler Selection Mode is prioritized above standard scoring controls */}
                    {needsBowlerChange && !isWicketMode ? (
                        <>
                            {/* Alert if ready to end over, but not yet in selection mode */}
                            {!isBowlerSelectionMode && (
                                <div className="mb-8 p-4 bg-orange-900/30 border border-orange-700 rounded-xl text-orange-200 text-center font-semibold">
                                    Over complete! Click "End Over" below to select the next bowler.
                                </div>
                            )}
                            
                            {isBowlerSelectionMode && <BowlerSelectionPanel />}
                        </>
                    ) : (
                        // Standard Scoring Controls
                        <div className="space-y-6" style={{ pointerEvents: isWicketMode ? 'none' : 'auto', opacity: isWicketMode ? 0.5 : 1 }}>
                            
                            {/* Runs */}
                            <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700 shadow-xl">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center"><Target className="mr-2 h-5 w-5" /> Score Runs</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {[0, 1, 2, 3, 4, 6].map(runs => (
                                        <button
                                            key={runs}
                                            onClick={() => runs === 0 ? handleDotBall() : handleRuns(runs)}
                                            className={`py-5 text-xl font-extrabold rounded-xl transition-all shadow-md
                                                ${runs === 0 ? 'bg-neutral-600 hover:bg-neutral-500 text-white'
                                                    : runs === 4 ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 ring-2 ring-blue-400'
                                                        : runs === 6 ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-110 ring-4 ring-purple-400'
                                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            {runs}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Extras & Wicket */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Extras */}
                                <div className="lg:col-span-2 bg-neutral-800/50 p-6 rounded-xl border border-neutral-700 shadow-xl">
                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center"><ArrowUpCircle className="mr-2 h-5 w-5" /> Extras</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <button onClick={() => handleExtra('wide')} className="py-3 bg-yellow-600/70 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors">Wide (+1)</button>
                                        <button onClick={() => handleExtra('noBall')} className="py-3 bg-orange-600/70 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">No Ball (+1)</button>
                                        <button onClick={() => handleExtra('bye')} className="py-3 bg-indigo-600/70 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors">Bye</button>
                                        <button onClick={() => handleExtra('legBye')} className="py-3 bg-pink-600/70 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors">Leg Bye</button>
                                    </div>
                                </div>

                                {/* Wicket Button */}
                                <div className="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700 shadow-xl flex items-center">
                                    <button
                                        onClick={() => setIsWicketMode(v => !v)}
                                        className={`w-full py-5 font-extrabold text-lg rounded-xl transition-all transform shadow-2xl ${isWicketMode
                                                ? 'bg-neutral-600 hover:bg-neutral-500 text-white'
                                                : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white hover:scale-[1.03] ring-4 ring-red-400/50'
                                            }`}
                                    >
                                        {'🛑 WICKET'}
                                    </button>
                                </div>
                            </div>

                            {/* End Over */}
                            <div>
                                <button
                                    onClick={() => {
                                        if (currentInnings.ballsInOver < 6) {
                                            // Safety check: Don't allow premature end over
                                            return; 
                                        }
                                        // Set mode to true, forcing BowlerSelectionPanel to show next
                                        setIsBowlerSelectionMode(true); 
                                    }}
                                    disabled={currentInnings.ballsInOver < 6 || isWicketMode || isBowlerSelectionMode}
                                    className={`w-full py-4 font-bold rounded-xl transition-colors text-lg mt-2 ${currentInnings.ballsInOver < 6 || isWicketMode || isBowlerSelectionMode
                                        ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                        : 'bg-neutral-700 hover:bg-neutral-600 text-white'
                                    }`}
                                >
                                    End Over & Select Next Bowler
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Innings End */}
                    {((currentInnings.wickets >= 10) || (currentInnings.overs >= (match.overs || 50) && currentInnings.ballsInOver >= 6)) && (
                        <div className="mt-8 pt-6 border-t border-neutral-700">
                            <button
                                onClick={() => emitScoreUpdate({ type: 'END_INNINGS' })}
                                className="w-full py-5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-extrabold text-xl rounded-xl shadow-lg transform hover:scale-[1.01]"
                            >
                                FINISH INNINGS
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ScoreUpdateControls;