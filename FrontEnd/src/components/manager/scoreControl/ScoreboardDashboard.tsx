import React, { useEffect, useCallback } from 'react';
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
import { Calendar, MapPin, Trophy, Activity } from 'lucide-react';
import type { ScoreUpdatePayload } from './scoreControlMenu/useScoreControls';

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
        const joinMatchRoom = () => {
            socket.emit("join-match", { matchId });
        };
        const handleConnect = () => {
            joinMatchRoom();
        };

        const handleScoreUpdate = (data: { matchId: string, liveScore: LiveScoreState }) => {
            if (data.matchId === matchId) {
                dispatch(updateLiveScore({ liveScore: data.liveScore }));
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

    if (error || !match || !teamA || !teamB) {
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
                        
                        {/* Match Info (Left) */}
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

                        {/* Teams (Right/Center) */}
                        <div className="flex items-center gap-3 md:gap-5">
                            <h1 className="text-2xl md:text-3xl font-medium tracking-tighter text-white">
                                {teamA.name}
                            </h1>
                            <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700/50 shadow-inner">
                                <span className="text-[10px] font-bold text-neutral-500 italic">VS</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-medium tracking-tighter text-white">
                                {teamB.name}
                            </h1>
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

                    {/* Right Column: Scoring Controls (Sticky) */}
                    <div className="xl:sticky xl:top-18 space-y-6">
                        <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-1">
                            <ScoreUpdateControls
                                match={match}
                                teamA={teamA}
                                teamB={teamB}
                                liveScore={liveScore}
                                emitScoreUpdate={emitScoreUpdate}
                            />
                        </div>

                        <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl flex gap-3 items-start">
                             <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 mt-0.5">
                                 <Activity size={16} />
                             </div>
                             <div>
                                 <h4 className="text-sm font-bold text-blue-200">Scorer Tip</h4>
                                 <p className="text-xs text-blue-300/70 mt-1 leading-relaxed">
                                     Use the "Special" menu for penalty runs or retirements. Wicket mode will lock other controls to prevent errors.
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ScoreboardDashboard;