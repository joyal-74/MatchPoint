import React, { useCallback } from "react";
import { Play, Sword, Zap, CheckCircle2, Lock } from "lucide-react";
import { CoinFlip } from "./CoinFlip";
import type { TeamId, TossDecision } from "./matchTypes";
import type { Team } from "../../../domain/match/types";

const COIN_FLIP_TIME_MS = 2500;

interface TossSectionProps {
    teamA: Team;
    teamB: Team;
    tossWinnerId: TeamId | null;
    tossDecision: TossDecision;
    isFlipping: boolean;
    setTossWinnerId: (id: TeamId | null) => void;
    setTossDecision: (decision: TossDecision) => void;
    setIsFlipping: (flipping: boolean) => void;
    isTossLocked: boolean;
}

export const TossSection: React.FC<TossSectionProps> = React.memo((props) => {
    const {
        teamA, teamB, tossWinnerId, tossDecision, isFlipping,
        setTossWinnerId, setTossDecision, setIsFlipping, isTossLocked
    } = props;

    const teams = [teamA, teamB];
    const tossWinner = teams.find(t => t._id === tossWinnerId);

    const handleCoinFlip = useCallback(() => {
        if (isFlipping) return;
        setTossDecision(null);
        setIsFlipping(true);

        setTimeout(() => {
            const winner = Math.random() < 0.5 ? teamA._id : teamB._id;
            setTossWinnerId(winner as TeamId);
            setIsFlipping(false);
        }, COIN_FLIP_TIME_MS + 200);
    }, [isFlipping, teamA._id, teamB._id, setTossWinnerId, setTossDecision, setIsFlipping]);

    const handleManualTossSelect = useCallback((teamId: TeamId) => {
        setTossWinnerId(teamId);
        setTossDecision(null);
    }, [setTossWinnerId, setTossDecision]);

    const handleDecision = useCallback((decision: TossDecision) => {
        setTossDecision(decision);
    }, [setTossDecision]);

    // Locked State View
    if (isTossLocked && tossWinner) {
        return (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-primary/5 border-b border-primary/10">
                    <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                        <CheckCircle2 size={18} /> Toss Complete
                    </h2>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                        <span className="text-muted-foreground text-sm">Winner</span>
                        <span className="font-bold text-foreground">{tossWinner.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                        <span className="text-muted-foreground text-sm">Decision</span>
                        <span className="font-bold text-primary flex items-center gap-2">
                            {tossDecision === "Batting" ? <Sword size={14} /> : <Zap size={14} />}
                            {tossDecision}
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                        <Lock size={12} /> Selection locked
                    </div>
                </div>
            </div>
        );
    }

    // Active Selection View
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm p-5 relative overflow-hidden">
            <h2 className="text-lg font-bold text-card-foreground mb-4">Toss Control</h2>
            
            <p className="text-sm text-muted-foreground mb-4">Who won the toss?</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
                {teams.map((team) => (
                    <button
                        key={team._id}
                        onClick={() => handleManualTossSelect(team._id as TeamId)}
                        disabled={isTossLocked || isFlipping}
                        className={`
                            py-3 px-2 rounded-lg text-sm font-semibold transition-all duration-200 border
                            ${tossWinnerId === team._id
                                ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/20 shadow-md'
                                : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground'
                            }
                        `}
                    >
                        {team.name}
                    </button>
                ))}
            </div>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-border"></div>
            </div>

            <button
                onClick={handleCoinFlip}
                disabled={isTossLocked || isFlipping}
                className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
                <Play size={18} className={isFlipping ? "animate-spin" : ""} />
                {isFlipping ? 'Flipping...' : 'Auto Flip Coin'}
            </button>

            {/* Animation Area */}
            <div className="mt-6 min-h-[60px] flex items-center justify-center">
                {isFlipping ? (
                    <CoinFlip isFlipping={isFlipping} />
                ) : tossWinner ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                         <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
                             <span className="text-foreground font-bold">{tossWinner.name}</span> won! Choose decision:
                         </p>
                         <div className="flex gap-3">
                             {['Batting', 'Bowling'].map((choice) => (
                                 <button
                                     key={choice}
                                     onClick={() => handleDecision(choice as TossDecision)}
                                     className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wide border transition-all
                                        ${tossDecision === choice 
                                            ? 'bg-primary/10 text-primary border-primary' 
                                            : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary'}
                                     `}
                                 >
                                     {choice}
                                 </button>
                             ))}
                         </div>
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground italic">Result will appear here</p>
                )}
            </div>
        </div>
    );
});