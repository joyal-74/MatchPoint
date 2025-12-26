import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadInitialLiveScore, loadMatchDashboard } from '../../../features/manager/Matches/matchThunks';
import { setInitialInnings, updateLiveScore } from '../../../features/manager/Matches/matchSlice';
import { createSocket, getSocket } from '../../../socket/socket';
import CurrentMatchState from './CurrentMatchState';
import ScoreUpdateControls from './scoreControlMenu/ScoreUpdateControls';
import FullScoreboardTabs from './FullScoreboardTabs';
import type { RootState } from '../../../app/rootReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { LiveScoreState } from '../../../features/manager/Matches/matchTypes';
import LoadingOverlay from '../../shared/LoadingOverlay';
import Navbar from '../Navbar';
import { Calendar, MapPin, Trophy, Activity, Radio } from 'lucide-react';
import type { ScoreUpdatePayload } from './scoreControlMenu/useScoreControls';
import { useStreamManager } from '../../../hooks/manager/useStreamManager';
import StreamManager from '../../../pages/manager/StreamManager';

const ScoreboardDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { matchId } = useParams<{ matchId: string }>();
    const { match, teamA, teamB, loading, error, liveScore } = useAppSelector((state: RootState) => state.match);

    const streamManagerData = useStreamManager(matchId);
    const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false);
    const [showEndMatchConfirm, setShowEndMatchConfirm] = useState(false);
    const [endReason, setEndReason] = useState<"RAIN" | "BAD_LIGHT" | "RAIN" | "OTHER">("RAIN");


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
        const joinMatchRoom = () => {
            socket.emit("join-match", { matchId });
        };
        const handleConnect = () => {
            joinMatchRoom();
        };

        const handleScoreUpdate = (data: { matchId: string, liveScore: LiveScoreState }) => {
            if (data.matchId === matchId) {
                const clonedLiveScore = JSON.parse(JSON.stringify(data.liveScore));
                dispatch(updateLiveScore({ liveScore: clonedLiveScore }));
            }
        };
        socket.on("connect", handleConnect);
        socket.on("live-score:update", handleScoreUpdate);
        if (socket.connected) {
            joinMatchRoom();
        }
        return () => {
            socket.off("connect", handleConnect);
            socket.off("live-score:update", handleScoreUpdate);
            socket.emit("leave-match", { matchId });
        };
    }, [matchId, dispatch]);

    const emitScoreUpdate = useCallback((payload: ScoreUpdatePayload) => {
        const socket = getSocket();
        if (socket && matchId) {
            socket.emit('score:update', payload);
        }
    }, [matchId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-neutral-500 font-mono text-sm">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !match || !teamA || !teamB || !liveScore) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="bg-red-900/10 border border-red-900/50 p-8 rounded-2xl max-w-md text-center">
                    <Activity className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Failed to Load Match</h2>
                    <p className="text-neutral-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
            <LoadingOverlay show={loading} />
            <Navbar />

            <main className="mx-auto p-4 md:p-6 mt-15">

                <header className="mb-6 relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg group">

                    <div className="relative px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6">

                        {/* Left Side: Live Badge & Metadata */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2.5">
                                <span className="flex relative h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                                </span>
                                <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Live Match</span>
                                <span className="w-px h-3 bg-neutral-800"></span>
                                <span className="text-neutral-400 text-xs font-mono">#{match.matchNumber}</span>
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 font-medium">
                                <span className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
                                    <Calendar size={12} className="text-neutral-600" />
                                    {new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
                                    <MapPin size={12} className="text-neutral-600" />
                                    {match.venue}
                                </span>
                                <span className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors">
                                    <Trophy size={12} className="text-neutral-600" />
                                    {match.overs ? `${match.overs} Overs` : 'T20'}
                                </span>
                            </div>
                        </div>

                        {/* Right Side: Stream Button & Teams */}
                        <div className="flex flex-row items-center gap-6">

                            {/* STREAM TOGGLE BUTTON */}
                            <button
                                onClick={() => setIsStreamDrawerOpen(true)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border
                                    ${streamManagerData.status === 'live'
                                        ? 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                        : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-white'}
                                `}
                            >
                                <Radio className={`w-4 h-4 ${streamManagerData.status === 'live' ? 'animate-pulse' : ''}`} />
                                {streamManagerData.status === 'live' ? 'On Air' : 'Stream'}
                            </button>

                            <div className="flex items-center gap-3 md:gap-5">
                                <h1 className="text-xl md:text-3xl font-medium tracking-tighter text-white">
                                    {teamA.name}
                                </h1>
                                <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700/50 shadow-inner">
                                    <span className="text-[10px] font-bold text-neutral-500 italic">VS</span>
                                </div>
                                <h1 className="text-xl md:text-3xl font-medium tracking-tighter text-white">
                                    {teamB.name}
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">

                    <div className="space-y-6 min-w-0">
                        <section aria-label="Live Match State">
                            <CurrentMatchState
                                match={match}
                                teamA={teamA}
                                teamB={teamB}
                                liveScore={liveScore}
                            />
                        </section>

                        <section aria-label="Full Scoreboard">
                            <FullScoreboardTabs
                                teamA={teamA}
                                teamB={teamB}
                                liveScore={liveScore}
                            />
                        </section>
                    </div>

                    <div className="xl:sticky xl:top-18 space-y-6">

                        {/* CONDITION: ONLY SHOW CONTROLS IF MATCH IS LIVE */}
                        {liveScore.status === "ongoing" ? (
                            <>
                                <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-1">
                                    <ScoreUpdateControls
                                        match={match}
                                        teamA={teamA}
                                        teamB={teamB}
                                        liveScore={liveScore}
                                        emitScoreUpdate={emitScoreUpdate}
                                    />
                                </div>

                                <button
                                    onClick={() => setShowEndMatchConfirm(true)}
                                    className="flex w-full justify-center items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider
                                        bg-red-600/10 text-red-500 border border-red-600/30
                                        hover:bg-red-600/20 transition-all"
                                >
                                    End Match
                                </button>
                            </>
                        ) : (
                            /* FALLBACK: MATCH ENDED CARD */
                            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 flex flex-col items-center text-center shadow-lg">
                                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-500/20">
                                    <Trophy className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Match Concluded</h3>
                                <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                                    The match has officially ended. Scoring controls have been disabled to prevent further changes.
                                </p>

                                <div className="w-full bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
                                    <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
                                        Final Result
                                    </span>
                                    <p className="text-white font-medium mt-1">
                                        {liveScore?.result || `Match ${liveScore.status}`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {liveScore.status === "LIVE" && (
                            <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl flex gap-3 items-start">
                                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 mt-0.5">
                                    <Activity size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-200">Scorer Tip</h4>
                                    <p className="text-xs text-blue-300/70 mt-1 leading-relaxed">
                                        Use the "Special" menu for penalty runs or retirements.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* KEEP MODAL OUTSIDE OR CONDITIONALLY RENDER IT */}
                        {showEndMatchConfirm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                                    <h3 className="text-lg font-bold text-white mb-2">End Match</h3>
                                    <p className="text-sm text-neutral-400 mb-4">
                                        Select the reason for ending the match. This action cannot be undone.
                                    </p>

                                    <label className="block text-xs text-neutral-400 mb-1">Reason</label>
                                    <select
                                        value={endReason}
                                        onChange={(e) => setEndReason(e.target.value as any)}
                                        className="w-full mb-5 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="RAIN">Rain</option>
                                        <option value="BAD_LIGHT">Bad Light</option>
                                        <option value="FORCE_END">Force End</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="OTHER">Other</option>
                                    </select>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setShowEndMatchConfirm(false)}
                                            className="px-4 py-2 rounded-lg text-sm bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                const socket = getSocket();
                                                socket?.emit("match:end", { matchId, reason: endReason });
                                                setShowEndMatchConfirm(false);
                                            }}
                                            className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
                                        >
                                            Confirm End
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>



                </div>
            </main>


            <StreamManager
                isOpen={isStreamDrawerOpen}
                onClose={() => setIsStreamDrawerOpen(false)}
                streamData={streamManagerData}
            />

        </div>
    );
};

export default ScoreboardDashboard;