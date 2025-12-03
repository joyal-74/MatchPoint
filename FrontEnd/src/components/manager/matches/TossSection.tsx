import React, { useCallback } from "react";

import { Play, Sword, Zap } from "lucide-react";
import { CoinFlip } from "./CoinFlip";
import type { TeamId, TossDecision } from "./matchTypes";
import type { Team } from "../../../features/manager/Matches/matchTypes";


const COIN_FLIP_TIME_MS = 2500;

interface TossSectionProps {
    team1: Team;
    team2: Team;
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
        team1, team2, tossWinnerId, tossDecision, isFlipping,
        setTossWinnerId, setTossDecision, setIsFlipping, isTossLocked
    } = props;

    const teams = [team1, team2];

    const tossWinner = teams.find(t => t.id === tossWinnerId);

    // Coin Flip Logic
    const handleCoinFlip = useCallback(() => {
        if (isFlipping) return;

        setTossDecision(null);
        setIsFlipping(true);

        setTimeout(() => {
            const winner = Math.random() < 0.5 ? team1.id : team2.id;
            setTossWinnerId(winner as TeamId);
            setIsFlipping(false);
        }, COIN_FLIP_TIME_MS + 200);
    }, [isFlipping, team1.id, team2.id, setTossWinnerId, setTossDecision, setIsFlipping]);

    // Manual Selection Logic
    const handleManualTossSelect = useCallback((teamId: TeamId) => {
        setTossWinnerId(teamId);
        setTossDecision(null);
    }, [setTossWinnerId, setTossDecision]);

    // Decision Logic
    const handleDecision = useCallback((decision: TossDecision) => {
        setTossDecision(decision);
    }, [setTossDecision]);

    if (isTossLocked && tossWinner) {
        return (
            <div className="mb-8">
                <h2 className="text-xl font-bold text-green-400 mb-4">Toss Details</h2>

                <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 shadow-lg">
                    <p className="text-neutral-300 mb-2">
                        Toss Winner:
                        <span className="text-yellow-400 font-bold ml-2">{tossWinner.name}</span>
                    </p>

                    <p className="text-neutral-300">
                        Decision:
                        <span className="text-green-400 font-bold ml-2">{tossDecision}</span>
                    </p>

                    <p className="text-neutral-500 text-xs mt-2">
                        Toss has been finalized. No further changes allowed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center space-x-2">
                <span>Toss Details</span>
            </h2>

            <div className="bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-700">
                <p className="text-neutral-300 text-sm mb-4 font-medium">Select Toss Winning Team or Flip Coin</p>

                <div className="flex flex-col space-y-3 mb-5">
                    {teams.map((team) => (
                        <button
                            key={team.id}

                            onClick={() => handleManualTossSelect(team.id as TeamId)}
                            className={`
                        w-full py-2 px-4 rounded-lg font-bold text-md transition duration-200 ease-in-out
                        ${tossWinnerId === team.id
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-700/50'
                                    : 'bg-neutral-600 text-neutral-200 hover:bg-neutral-600'
                                }
                    `}
                            disabled={isTossLocked || isFlipping}
                        >
                            {team.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex-1 border-t border-neutral-700"></div>
                    <span className="text-neutral-400 text-sm">OR</span>
                    <div className="flex-1 border-t border-neutral-700"></div>
                </div>

                <button
                    onClick={handleCoinFlip}
                    disabled={isTossLocked || isFlipping}
                    className="mt-5 w-full bg-purple-600 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 shadow-lg shadow-purple-700/50 hover:bg-purple-700 transition duration-200 disabled:opacity-50"
                >
                    <Play size={20} />
                    {isFlipping ? 'Flipping...' : 'Toss & Pick'}
                </button>

                <div className="mt-5">
                    {isFlipping ? (
                        <CoinFlip isFlipping={isFlipping} />
                    ) : tossWinner ? (
                        <p className="text-center text-md font-extrabold text-yellow-400 mt-2">
                            {tossWinner.name} won the toss!
                        </p>
                    ) : (
                        <p className="text-center text-neutral-500 mt-2 text-sm">
                            Click 'Toss & Pick' to see the animation.
                        </p>
                    )}
                </div>
            </div>

            {tossWinner && (
                <div className="mt-6">
                    <p className="text-neutral-300 font-medium mb-3">Toss Decision</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleDecision('Batting')}
                            disabled={isTossLocked}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm transition duration-200 flex items-center justify-center space-x-2 ${tossDecision === 'Batting'
                                ? 'bg-green-600 text-white shadow-lg shadow-green-700/50'
                                : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                                }`}
                        >
                            <Sword size={20} />
                            <span>Batting</span>
                        </button>
                        <button
                            onClick={() => handleDecision('Bowling')}
                            disabled={isTossLocked}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm transition duration-200 flex items-center justify-center space-x-2 ${tossDecision === 'Bowling'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-700/50'
                                : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                                }`}
                        >
                            <Zap size={20} />
                            <span>Bowling</span>
                        </button>
                    </div>
                    {tossDecision && (
                        <p className="text-center text-sm text-green-400 mt-3">
                            {tossWinner.name} chose to <span className="font-bold">{tossDecision}</span>.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});