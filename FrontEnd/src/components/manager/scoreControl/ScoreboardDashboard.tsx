import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { loadInitialLiveScore, loadMatchDashboard } from '../../../features/manager/Matches/matchThunks';
import { setInitialInnings, updateLiveScore } from '../../../features/manager/Matches/matchSlice';
import { createSocket, getSocket } from '../../../socket/socket';

import CurrentMatchState from './CurrentMatchState';
import ScoreUpdateControls from './ScoreUpdateControls';
import FullScoreboardTabs from './FullScoreboardTabs';
import type { RootState } from '../../../app/rootReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { BallEvent, LiveScoreState } from '../../../features/manager/Matches/matchTypes';
import LoadingOverlay from '../../shared/LoadingOverlay';
import Navbar from '../Navbar';

const ScoreboardDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { matchId } = useParams<{ matchId: string }>();
    const { match, teamA, teamB, loading, error, liveScore } = useAppSelector((state: RootState) => state.match);

    useEffect(() => {
        if (matchId) {
            dispatch(loadMatchDashboard(matchId))
                .unwrap()
                .then((data) => {
                    dispatch(setInitialInnings({ match: data.match }));

                    dispatch(loadInitialLiveScore(matchId));
                });
        }
    }, [matchId, dispatch]);

    useEffect(() => {
        if (!matchId) return;

        const socket = createSocket();

        const handleScoreUpdate = (data: { matchId: string, liveScore: LiveScoreState }) => {
            if (data.matchId === matchId) {
                console.log("📡 Received Live Score Update");
                dispatch(updateLiveScore({ liveScore: data.liveScore }));
            }
        };

        socket.on("live-score:update", handleScoreUpdate);

        return () => {
            socket.off('live-score:update', handleScoreUpdate);
        };
    }, [matchId, dispatch]);

    const emitScoreUpdate = useCallback((ballData: BallEvent) => {
        const socket = getSocket();
        if (socket && matchId) {
            socket.emit('score:update', {
                matchId,
                ...ballData,
            });
            console.log("⬆️ Emitted Score Update:", ballData);
        }
    }, [matchId]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-neutral-400">Loading match details...</p>
                </div>
            </div>
        );
    }

    if (error || !match || !teamA || !teamB) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 flex items-center justify-center">
                <div className="bg-red-900/30 border border-red-700/50 p-8 rounded-xl max-w-md">
                    <div className="text-red-400 text-2xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-white mb-2">Error Loading Match</h2>
                    <p className="text-neutral-300">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <LoadingOverlay show={loading} />
            <Navbar />
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white p-4 md:p-8 mt-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                Cricket Match Dashboard
                            </h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                                    #{match.matchNumber}
                                </span>
                                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm">
                                    {match.venue}
                                </span>
                                <span className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                                    {new Date(match.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Live Score & Controls */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <h2 className="text-2xl font-bold">Live Match State</h2>
                            </div>
                            <CurrentMatchState
                                match={match}
                                teamA={teamA}
                                teamB={teamB}
                                liveScore={liveScore}
                            />
                        </div>

                        <div>
                            <div className="flex items-center mb-4">
                                <h2 className="text-2xl font-bold">Score Update Panel</h2>
                            </div>
                            <ScoreUpdateControls
                                match={match}
                                teamA={teamA}
                                teamB={teamB}
                                liveScore={liveScore}
                                emitScoreUpdate={emitScoreUpdate}
                            />
                        </div>
                    </div>

                    {/* Scoreboard Tabs */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="flex items-center mb-4">
                                <h2 className="text-2xl font-bold">Detailed Scoreboard</h2>
                            </div>
                            <FullScoreboardTabs teamA={teamA} teamB={teamB} match={match} liveScore={liveScore} />
                        </div>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-12 pt-8 border-t border-neutral-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-neutral-800/30 rounded-xl">
                            <div className="text-3xl font-bold text-blue-400">
                                {liveScore?.innings1?.overs || 0} / {match.overs || 50}
                            </div>
                            <div className="text-neutral-400 mt-2">Overs Remaining</div>
                        </div>
                        <div className="text-center p-6 bg-neutral-800/30 rounded-xl">
                            <div className="text-3xl font-bold text-green-400">
                                {liveScore?.innings1?.wickets || 0} / 10
                            </div>
                            <div className="text-neutral-400 mt-2">Wickets Lost</div>
                        </div>
                        <div className="text-center p-6 bg-neutral-800/30 rounded-xl">
                            <div className="text-3xl font-bold text-yellow-400">
                                {liveScore?.currentRunRate?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-neutral-400 mt-2">Current Run Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ScoreboardDashboard;