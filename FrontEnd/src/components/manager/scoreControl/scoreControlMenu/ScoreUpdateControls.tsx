import React from 'react';
import { Settings, Play, RotateCw, Undo, MoreHorizontal, CircleDot } from 'lucide-react';
import { useScoreControls, type ScoreUpdatePayload } from './useScoreControls';
import { InitialSetupModal, BowlerChangeModal, ChangeStrikerModal, ChangeNonStrikerModal, SpecialModal } from './ScoringModals';
import { WicketPanel } from './WicketPanel';
import type { Match, LiveScoreState, Team } from '../../../../features/manager/Matches/matchTypes';

interface ScoreUpdateControlsProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
    emitScoreUpdate: (payload: ScoreUpdatePayload) => void;
    emitUndoAction?: () => void;
}

const ScoreUpdateControls: React.FC<ScoreUpdateControlsProps> = (props) => {
    const logic = useScoreControls(props);
    const {
        match, currentInnings, ballsInOver, needsInitialSetup, disabled,
        modals, isWicketMode,
        setIsWicketMode, updateForm, toggleModal,
        bowlingTeam,
        actions
    } = logic;

    // 2. Loading State
    if (!props.liveScore) return <div className="p-8 text-center text-sm text-neutral-500 italic">Initializing console...</div>;
    if (!currentInnings) return <div className="p-8 text-center text-sm text-neutral-500 italic">Waiting for innings...</div>;

    // 3. Render
    return (
        <div className="w-full max-w-2xl mx-auto bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden select-none">
            {/* Header Control Bar */}
            <div className="bg-neutral-900/50 px-4 py-3 border-b border-neutral-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Scoring Console</span>
                </div>
                <div className="flex items-center gap-2 relative">
                    <button
                        onClick={() => toggleModal('settings', !modals.settings)}
                        className={`p-2 rounded-lg transition-all ${modals.settings ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                    >
                        <Settings size={16} />
                    </button>
                    {/* Settings Dropdown */}
                    {modals.settings && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => toggleModal('settings', false)} />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-20 py-1">
                                <button onClick={() => { toggleModal('changeStriker', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Change Striker</button>
                                <button onClick={() => { toggleModal('changeNonStriker', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Change Non-Striker</button>
                                <button onClick={() => { toggleModal('bowlerChange', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Change Bowler</button>
                                <div className="h-px bg-neutral-800 my-1"></div>
                                <button onClick={() => { toggleModal('initialSetup', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Edit Opening Setup</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Main Interaction Area */}
            <div className="p-6">
                {needsInitialSetup ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800">
                            <Play className="text-neutral-500" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Ready to Start?</h3>
                        <p className="text-neutral-500 text-sm mb-6">Set up the opening batsmen and bowler.</p>
                        <button onClick={() => toggleModal('initialSetup', true)} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors">
                            Setup Innings
                        </button>
                    </div>
                ) : isWicketMode ? (
                    <WicketPanel onClose={() => setIsWicketMode(false)} {...logic} />
                ) : (
                    <div className="space-y-6">
                        {/* Scoring Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {[0, 1, 2, 3].map(runs => (
                                <button
                                    disabled={disabled}
                                    key={runs}
                                    onClick={() => actions.handleRuns(runs)}
                                    className={`h-14 rounded-xl font-bold text-xl transition-all active:scale-95 border ${runs === 0 ? 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-300' : 'bg-neutral-900 text-white border-neutral-800 hover:bg-neutral-800'}`}
                                >
                                    {runs === 0 ? <span className="text-2xl">•</span> : runs}
                                </button>
                            ))}
                            <button disabled={disabled} onClick={() => actions.handleRuns(4)} className="h-14 rounded-xl font-bold text-xl transition-all active:scale-95 bg-blue-900/20 text-blue-500 border border-blue-900/50 hover:bg-blue-900/30">4</button>
                            <button disabled={disabled} onClick={() => actions.handleRuns(6)} className="h-14 rounded-xl font-bold text-xl transition-all active:scale-95 bg-purple-900/20 text-purple-500 border border-purple-900/50 hover:bg-purple-900/30">6</button>
                            <button onClick={() => setIsWicketMode(true)} className="col-span-2 h-14 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-95 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/30 flex items-center justify-center gap-2">
                                <CircleDot size={16} /> Wicket
                            </button>
                        </div>

                        {/* Extras */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-600 mb-2">Extras</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['wide', 'noBall', 'bye', 'legBye'] as const).map(type => (
                                    <button key={type} disabled={disabled} onClick={() => actions.handleExtra(type)} className="py-2 rounded-lg text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white hover:border-neutral-600 transition-all">
                                        {type === 'noBall' ? 'NB' : type === 'legBye' ? 'LB' : type === 'wide' ? 'WD' : 'B'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800/50">
                            <button onClick={actions.handleUndo} className="h-12 rounded-xl bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm">
                                <Undo size={16} /> Undo
                            </button>
                            <button disabled={disabled} onClick={() => toggleModal('special', true)} className="h-12 rounded-xl bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm">
                                <MoreHorizontal size={16} /> Special
                            </button>
                        </div>

                        {/* Bowler / End Inning Actions */}
                        <button
                            onClick={() => {
                                if (ballsInOver >= 6 || window.confirm('End over early?')) {
                                    updateForm('newBowlerId', ''); // Reset choice
                                    toggleModal('bowlerChange', true);
                                }
                            }}
                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${ballsInOver >= 6 ? 'bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10' : 'bg-neutral-900 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
                        >
                            {ballsInOver >= 6 ? <><RotateCw size={16} /> End Over & Switch</> : 'End Over Early'}
                        </button>
                        {((currentInnings.wickets >= 10) || (currentInnings.overLimit >= (match.overs || 50) && ballsInOver >= 6)) && (
                            <button onClick={actions.handleEndInnings} className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-900/20">
                                Finish Innings
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Render Modals */}
            <InitialSetupModal isOpen={modals.initialSetup} onClose={() => toggleModal('initialSetup', false)} {...logic} />
            {currentInnings && (
                <ChangeStrikerModal
                    isOpen={modals.changeStriker}
                    onClose={() => toggleModal('changeStriker', false)}
                    {...logic}
                />
            )}
            {currentInnings && (
                <ChangeNonStrikerModal
                    isOpen={modals.changeNonStriker}
                    onClose={() => toggleModal('changeNonStriker', false)}
                    {...logic}
                />
            )}

            {currentInnings && bowlingTeam && (
                <BowlerChangeModal
                    isOpen={modals.bowlerChange}
                    onClose={() => toggleModal('bowlerChange', false)}
                    {...logic}
                />
            )}

            {currentInnings && (
                <SpecialModal
                    isOpen={modals.special}
                    onClose={() => toggleModal('special', false)}
                    {...logic}
                />
            )}
        </div>
    );
};

export default ScoreUpdateControls;