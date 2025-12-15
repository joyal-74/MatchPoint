import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { BatsmanStats, BowlerStats, MatchState, ScoreUpdateHandler, TeamScore, Player, Team } from './MatchTypes'; 
import Scoreboard from './Scoreboard';
import ScoreControlPanel from './ScoreControlPanel';
import BatsmanTable from './BatsmanTable';
import FullScorecard from './FullScorecard';
import Navbar from '../../Navbar';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { loadMatchDashboard } from '../../../../features/manager/Matches/matchThunks';
import { getSocket, createSocket } from '../../../../socket/socket';

// --- Helper functions ---
const createInitialBowlerStats = (player: Player): BowlerStats => ({
    id: player.id,
    name: player.name,
    overs: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
});

const createInitialBatsmanStats = (player: Player, isStriker: boolean): BatsmanStats => ({
    id: player.id,
    name: player.name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isStriker,
    outDescription: null,
});

const MatchControlPage: React.FC = () => {
    const [matchState, setMatchState] = useState<MatchState | null>(null);
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [selection, setSelection] = useState<{ strikerId: string | null; nonStrikerId: string | null; bowlerId: string | null }>({
        strikerId: null,
        nonStrikerId: null,
        bowlerId: null,
    });

    const dispatch = useAppDispatch();
    const { matchId } = useParams<{ matchId: string }>();
    const { match, teamA, teamB, loading, error } = useAppSelector((state) => state.match);

    useEffect(() => {
        if (matchId) dispatch(loadMatchDashboard(matchId));
    }, [matchId, dispatch]);

    const availableBatsmen = useMemo(() => teamA?.members || [], [teamA]);
    const availableBowlers = useMemo(() => teamB?.members || [], [teamB]);

    // --- Start match after player selection ---
    const handleStartMatch = useCallback(() => {
        if (!teamA || !teamB || !selection.strikerId || !selection.nonStrikerId || !selection.bowlerId) return;

        const striker = teamA.members.find(p => p._id === selection.strikerId);
        const nonStriker = teamA.members.find(p => p._id === selection.nonStrikerId);
        const bowler = teamB.members.find(p => p._id === selection.bowlerId);
        if (!striker || !nonStriker || !bowler) return;

        const teamAScore: TeamScore = {
            name: teamA.name,
            totalRuns: 0,
            wickets: 0,
            overs: 0.0,
            batsmen: [createInitialBatsmanStats(striker, true), createInitialBatsmanStats(nonStriker, false)],
            currentBowler: createInitialBowlerStats(bowler),
        };

        const teamBScore: TeamScore = {
            name: teamB.name,
            totalRuns: 0,
            wickets: 0,
            overs: 0.0,
            batsmen: [],
            currentBowler: { id: -1, name: 'TBD Bowler', overs: 0, maidens: 0, runsConceded: 0, wickets: 0 },
        };

        setMatchState({
            currentInnings: 'TeamA',
            teamA: teamAScore,
            teamB: teamBScore,
            lastFiveBalls: [],
            innings1: null,
            innings2: null,
            matchResult: null,
        });

        setIsSetupComplete(true);
    }, [teamA, teamB, selection]);

    // --- Socket connection for real-time updates ---
    useEffect(() => {
        if (!matchId || !matchState || !isSetupComplete) return;

        const socket = createSocket();
        socket.emit('joinMatchRoom', matchId);

        const handleRealtimeUpdate = (newState: MatchState) => setMatchState(newState);
        socket.on(`match-update-${matchId}`, handleRealtimeUpdate);

        return () => {
            socket.off(`match-update-${matchId}`);
            socket.emit('leaveMatchRoom', matchId);
        };
    }, [matchId, matchState, isSetupComplete]);

    // --- Handlers to emit score / end innings events ---
    const handleScoreUpdate: ScoreUpdateHandler = useCallback((type, value = 0) => {
        const socket = getSocket();
        if (!socket || !matchId || !matchState) return;

        socket.emit('scoreEvent', { matchId, currentInnings: matchState.currentInnings, type, value });
    }, [matchId, matchState]);

    const handleEndInnings = useCallback(() => {
        const socket = getSocket();
        if (!socket || !matchId || !matchState) return;

        socket.emit('endInningsOrMatch', { matchId, currentInnings: matchState.currentInnings });
    }, [matchId, matchState]);

    const isMatchOver = matchState?.matchResult !== null;

    if (loading || (!teamA && !teamB)) {
        return <div className="pt-20 mx-12 text-center text-neutral-100">Loading Match Data...</div>;
    }

    if (error) {
        return <div className="pt-20 mx-12 text-center text-red-400">Error loading match details: {error}</div>;
    }

    // --- Match setup selection UI ---
    if (!isSetupComplete || !matchState) {
        const renderSelect = (
            label: string,
            options: { id: number; name: string }[],
            selectedId: number | null,
            onChange: (id: number) => void,
            disabledIds: number[] = []
        ) => (
            <div className="flex flex-col">
                <label className="text-lg font-semibold mb-2">{label}</label>
                <select
                    className="p-3 rounded bg-neutral-700 text-white"
                    value={selectedId || ''}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                >
                    <option value="" disabled>Select</option>
                    {options.map(opt => (
                        <option key={opt.id} value={opt.id} disabled={disabledIds.includes(opt.id)}>
                            {opt.name}
                        </option>
                    ))}
                </select>
            </div>
        );

        return (
            <div className="pt-20 mx-12 bg-neutral-900 text-neutral-100 min-h-screen">
                <h2 className="text-3xl font-bold mb-8 text-center text-yellow-400">
                    🏟️ Match Setup: Select Starting Players
                </h2>
                <div className="max-w-xl mx-auto p-6 bg-neutral-800 rounded-lg shadow-xl space-y-6">
                    {renderSelect(
                        `Batting Team: ${teamA!.name} | Striker`,
                        availableBatsmen,
                        selection.strikerId,
                        (id) => setSelection(prev => ({ ...prev, strikerId: id }))
                    )}
                    {renderSelect(
                        `Batting Team: ${teamA!.name} | Non-Striker`,
                        availableBatsmen,
                        selection.nonStrikerId,
                        (id) => setSelection(prev => ({ ...prev, nonStrikerId: id })),
                        selection.strikerId ? [selection.strikerId] : []
                    )}
                    {renderSelect(
                        `Bowling Team: ${teamB!.name} | Opening Bowler`,
                        availableBowlers,
                        selection.bowlerId,
                        (id) => setSelection(prev => ({ ...prev, bowlerId: id }))
                    )}

                    <button
                        onClick={handleStartMatch}
                        disabled={
                            !selection.strikerId ||
                            !selection.nonStrikerId ||
                            !selection.bowlerId ||
                            selection.strikerId === selection.nonStrikerId
                        }
                        className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${
                            selection.strikerId && selection.nonStrikerId && selection.bowlerId && selection.strikerId !== selection.nonStrikerId
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-neutral-600 cursor-not-allowed'
                        }`}
                    >
                        Start Match
                    </button>
                </div>
            </div>
        );
    }

    // --- Match control UI ---
    const currentTeamKey = matchState.currentInnings === 'TeamA' ? 'teamA' : 'teamB';
    const currentTeamScore = matchState[currentTeamKey];

    if (!currentTeamScore || !currentTeamScore.currentBowler || !currentTeamScore.batsmen) {
        return <div className="pt-20 mx-12 text-center text-red-400">Critical Match state data is missing after setup.</div>;
    }

    return (
        <>
            <Navbar />
            <div className="pt-20 mx-12 bg-neutral-900 text-neutral-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-4 text-center text-indigo-400">
                    Live Match Control: {teamA!.name} vs {teamB!.name}
                </h1>

                {isMatchOver ? (
                    <>
                        <h2 className="text-4xl font-bold mb-8 text-center text-green-400">Match Over!</h2>
                        <p className="text-xl text-center mb-10">{matchState.matchResult}</p>
                        <FullScorecard matchState={matchState} />
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Scoreboard teamScore={currentTeamScore} lastFiveBalls={matchState.lastFiveBalls} />
                                <BatsmanTable batsmen={currentTeamScore.batsmen} />
                            </div>
                            <div className="lg:col-span-1 space-y-8">
                                <ScoreControlPanel
                                    handleScoreUpdate={handleScoreUpdate}
                                    currentBowler={currentTeamScore.currentBowler}
                                />
                                <button
                                    onClick={handleEndInnings}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                                >
                                    End Innings / End Match
                                </button>
                            </div>
                        </div>
                        <div className="py-8">
                            <FullScorecard matchState={matchState} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MatchControlPage;
