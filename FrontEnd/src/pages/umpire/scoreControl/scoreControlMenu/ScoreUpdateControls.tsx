import React from 'react';
import { Settings, Play, RotateCw, Undo, MoreHorizontal, CircleDot } from 'lucide-react';
import { useScoreControls, type ScoreUpdatePayload } from './useScoreControls';
import { InitialSetupModal, BowlerChangeModal, ChangeStrikerModal, ChangeNonStrikerModal, SpecialModal } from './ScoringModals';
import { WicketPanel } from './WicketPanel';
import type { Match } from '../../../../features/manager/managerTypes';
import type { LiveScoreState, Team } from '../../../../features/manager/Matches/matchTypes';

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
        currentInnings, ballsInOver, needsInitialSetup, disabled,
        modals, isWicketMode,
        setIsWicketMode, toggleModal,
        actions
    } = logic;

    // --- Loading States ---
    if (!props.liveScore) return <div className="p-8 text-center text-sm text-muted-foreground italic">Initializing console...</div>;
    if (!currentInnings) return <div className="p-8 text-center text-sm text-muted-foreground italic">Waiting for innings...</div>;

    // --- Render ---
    return (
        <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl border border-border shadow-sm overflow-hidden select-none">
            
            {/* 1. Header Control Bar */}
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Scoring Console</span>
                </div>
                
                <div className="flex items-center gap-2 relative">
                    <button
                        onClick={() => toggleModal('settings', !modals.settings)}
                        className={`p-2 rounded-lg transition-all ${modals.settings ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                        <Settings size={16} />
                    </button>
                    
                    {/* Settings Dropdown */}
                    {modals.settings && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => toggleModal('settings', false)} />
                            <div className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button onClick={() => { toggleModal('changeStriker', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted transition-colors">Change Striker</button>
                                <button onClick={() => { toggleModal('changeNonStriker', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted transition-colors">Change Non-Striker</button>
                                <button onClick={() => { toggleModal('bowlerChange', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted transition-colors">Change Bowler</button>
                                <div className="h-px bg-border my-1"></div>
                                <button onClick={() => { toggleModal('initialSetup', true); toggleModal('settings', false); }} className="w-full text-left px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted transition-colors">Edit Opening Setup</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 2. Main Interaction Area */}
            <div className="p-6">
                {needsInitialSetup ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                            <Play className="text-muted-foreground" />
                        </div>
                        <h3 className="text-foreground font-bold mb-2">Ready to Start?</h3>
                        <p className="text-muted-foreground text-sm mb-6">Set up the opening batsmen and bowler to begin.</p>
                        <button 
                            onClick={() => toggleModal('initialSetup', true)} 
                            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20"
                        >
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
                                    className={`
                                        h-14 rounded-xl font-bold text-xl transition-all active:scale-95 border
                                        ${runs === 0 
                                            ? 'bg-muted/30 text-muted-foreground border-border hover:bg-muted hover:text-foreground' 
                                            : 'bg-card text-foreground border-border hover:bg-muted/50 hover:border-primary/30'
                                        }
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                >
                                    {runs === 0 ? <span className="text-2xl leading-none">•</span> : runs}
                                </button>
                            ))}
                            
                            {/* Special Runs Buttons - Preserving visual distinctness for quick scoring */}
                            <button 
                                disabled={disabled} 
                                onClick={() => actions.handleRuns(4)} 
                                className="h-14 rounded-xl font-bold text-xl transition-all active:scale-95 bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 disabled:opacity-50"
                            >
                                4
                            </button>
                            <button 
                                disabled={disabled} 
                                onClick={() => actions.handleRuns(6)} 
                                className="h-14 rounded-xl font-bold text-xl transition-all active:scale-95 bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 disabled:opacity-50"
                            >
                                6
                            </button>
                            
                            {/* Wicket Button */}
                            <button 
                                onClick={() => setIsWicketMode(true)} 
                                className="col-span-2 h-14 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-95 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <CircleDot size={16} /> Wicket
                            </button>
                        </div>

                        {/* Extras Row */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Extras</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['wide', 'noBall', 'bye', 'legBye'] as const).map(type => (
                                    <button 
                                        key={type} 
                                        disabled={disabled} 
                                        onClick={() => actions.handleExtra(type)} 
                                        className="py-2.5 rounded-lg text-xs font-bold text-muted-foreground bg-muted/20 border border-border hover:text-foreground hover:bg-muted hover:border-primary/30 transition-all disabled:opacity-50"
                                    >
                                        {type === 'noBall' ? 'NB' : type === 'legBye' ? 'LB' : type === 'wide' ? 'WD' : 'B'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                            <button 
                                onClick={actions.handleUndo} 
                                className="h-12 rounded-xl bg-secondary/50 text-secondary-foreground border border-border hover:bg-secondary hover:border-foreground/20 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                            >
                                <Undo size={16} /> Undo
                            </button>
                            <button 
                                disabled={disabled} 
                                onClick={() => toggleModal('special', true)} 
                                className="h-12 rounded-xl bg-secondary/50 text-secondary-foreground border border-border hover:bg-secondary hover:border-foreground/20 transition-all flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
                            >
                                <MoreHorizontal size={16} /> Special
                            </button>
                        </div>

                        {/* Bowler / End Over Actions */}
                        <button
                            onClick={() => {
                                if (ballsInOver >= 6 || window.confirm('End over early?')) {
                                    logic.updateForm('newBowlerId', ''); // Reset choice
                                    toggleModal('bowlerChange', true);
                                }
                            }}
                            className={`
                                w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border
                                ${ballsInOver >= 6 
                                    ? 'bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-md shadow-primary/20 animate-pulse-slow' 
                                    : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                                }
                            `}
                        >
                            {ballsInOver >= 6 ? <><RotateCw size={16} /> End Over & Switch</> : 'End Over Early'}
                        </button>

                        {/* End Innings Condition */}
                        {((currentInnings.wickets >= 10) || (currentInnings.overLimit >= (props.match.overs || 50) && ballsInOver >= 6)) && (
                            <button 
                                onClick={actions.handleEndInnings} 
                                className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition-all shadow-md shadow-destructive/20"
                            >
                                Finish Innings
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
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
            {currentInnings && logic.bowlingTeam && (
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