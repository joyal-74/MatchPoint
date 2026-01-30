import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Activity, Radio, AlertTriangle, Power, Clock, ArrowRight } from 'lucide-react';

// Redux & State
import { loadInitialLiveScore, loadMatchDashboard } from '../../../features/manager/Matches/matchThunks';
import { setInitialInnings, updateLiveScore } from '../../../features/manager/Matches/matchSlice';
import type { RootState } from '../../../app/rootReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import type { LiveScoreState } from '../../../features/manager/Matches/matchTypes';
import type { ScoreUpdatePayload } from './scoreControlMenu/useScoreControls';

// Socket & Utils
import { createSocket, getSocket } from '../../../socket/socket';
import { useStreamManager } from '../../../hooks/manager/useStreamManager';

// Components
import CurrentMatchState from './CurrentMatchState';
import ScoreUpdateControls from './scoreControlMenu/ScoreUpdateControls';
import FullScoreboardTabs from './FullScoreboardTabs';
import Navbar from '../Navbar';
import StreamManager from '../../../pages/manager/StreamManager';
import LoadingOverlay from '../../shared/LoadingOverlay';

type endReason = "RAIN" | "BAD_LIGHT" | "FORCE_END" | "COMPLETED" | "OTHER"

const ScoreboardDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { matchId } = useParams<{ matchId: string }>();
    const { match, teamA, teamB, loading, error, liveScore } = useAppSelector((state: RootState) => state.match);

    const streamManagerData = useStreamManager(matchId);
    const [isStreamDrawerOpen, setIsStreamDrawerOpen] = useState(false);
    
    // --- End Match Logic States ---
    const [showEndMatchConfirm, setShowEndMatchConfirm] = useState(false);
    const [endReason, setEndReason] = useState<endReason>("COMPLETED");
    const [winnerId, setWinnerId] = useState<string>("");
    const [winMargin, setWinMargin] = useState<string>("");
    const [winType, setWinType] = useState<"runs" | "wickets">("runs");

    // --- 1. Initial Data Load ---
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

    // --- 2. Socket Connection ---
    useEffect(() => {
        if (!matchId) return;
        const socket = createSocket();
        const joinMatchRoom = () => socket.emit("join-match", { matchId });
        const handleScoreUpdate = (data: { matchId: string, liveScore: LiveScoreState }) => {
            if (data.matchId === matchId) {
                const clonedLiveScore = JSON.parse(JSON.stringify(data.liveScore));
                dispatch(updateLiveScore({ liveScore: clonedLiveScore }));
            }
        };

        socket.on("connect", joinMatchRoom);
        socket.on("live-score:update", handleScoreUpdate);
        if (socket.connected) joinMatchRoom();

        return () => {
            socket.off("connect", joinMatchRoom);
            socket.off("live-score:update", handleScoreUpdate);
            socket.emit("leave-match", { matchId });
        };
    }, [matchId, dispatch]);

    const emitScoreUpdate = useCallback((payload: ScoreUpdatePayload) => {
        const socket = getSocket();
        if (socket && matchId) socket.emit('score:update', payload);
    }, [matchId]);

    // --- 3. Handle End Match ---
    const handleConfirmEndMatch = () => {
        const socket = getSocket();
        if (!socket) return;

        // Validation: If completed, ensure winner is selected (unless it's a tie)
        if (endReason === 'COMPLETED' && !winnerId && winnerId !== 'TIE' && winnerId !== 'DRAW') {
            alert("Please select a winner or declare a Tie/Draw.");
            return;
        }

        const payload = {
            matchId,
            reason: endReason,
            resultData: endReason === 'COMPLETED' ? {
                winnerId: winnerId === 'TIE' || winnerId === 'DRAW' ? null : winnerId,
                resultType: winnerId === 'TIE' ? 'TIE' : winnerId === 'DRAW' ? 'DRAW' : 'WIN',
                winType: winType,
                margin: winMargin
            } : null
        };

        socket.emit("match:end", payload);
        setShowEndMatchConfirm(false);
    };

    // --- 4. Loading & Error States ---
    if (loading) return <LoadingOverlay show={true} />;
    if (error || !match || !teamA || !teamB || !liveScore) return <div className="text-center p-10">Error loading match</div>;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Navbar />
            
            <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">

                {/* === HEADER === */}
                <header className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm group">
                    <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-bl-full -mr-10 -mt-10 blur-3xl pointer-events-none" />
                    <div className="relative px-6 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                        
                        {/* Meta Info */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                {liveScore.status === 'ongoing' ? (
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                                    </span>
                                ) : (
                                    <Clock size={14} className="text-muted-foreground" />
                                )}
                                <span className={`text-xs font-bold uppercase tracking-widest ${liveScore.status === 'ongoing' ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {liveScore.status === 'upcoming' ? 'Upcoming' : liveScore.status}
                                </span>
                                <span className="w-px h-4 bg-border"></span>
                                <span className="text-muted-foreground text-xs font-mono">MATCH #{match.matchNumber}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(match.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {match.venue}</span>
                                <span className="flex items-center gap-2"><Trophy size={14} className="text-primary" /> {match.overs ? `${match.overs} Overs` : 'T20'}</span>
                            </div>
                        </div>

                        {/* Teams & Stream */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{teamA.name}</h1>
                                <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-muted border border-border"><span className="text-[10px] font-black text-muted-foreground">VS</span></div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{teamB.name}</h1>
                            </div>
                            <div className="h-8 w-px bg-border hidden sm:block" />
                            <button
                                onClick={() => setIsStreamDrawerOpen(true)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${streamManagerData.status === 'live' ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse-slow' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'}`}
                            >
                                <Radio className="w-4 h-4" /> {streamManagerData.status === 'live' ? 'On Air' : 'Stream Manager'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* === MAIN CONTENT GRID === */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">

                    {/* Left Column */}
                    <div className="space-y-6 min-w-0">
                        <section aria-label="Live Match State">
                            <CurrentMatchState match={match} teamA={teamA} teamB={teamB} liveScore={liveScore} />
                        </section>
                        <section aria-label="Full Scoreboard">
                            <FullScoreboardTabs teamA={teamA} teamB={teamB} liveScore={liveScore} />
                        </section>
                    </div>

                    {/* Right Column: Controls Logic */}
                    <div className="xl:sticky xl:top-24 space-y-6">
                        
                        {/* CASE 1: ONGOING - Show Controls */}
                        {liveScore.status === "ongoing" && (
                            <>
                                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-border bg-muted/30">
                                        <h3 className="font-semibold text-card-foreground flex items-center gap-2"><Activity size={18} className="text-primary" /> Scorer Console</h3>
                                    </div>
                                    <div className="p-1">
                                        <ScoreUpdateControls match={match} teamA={teamA} teamB={teamB} liveScore={liveScore} emitScoreUpdate={emitScoreUpdate} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowEndMatchConfirm(true)}
                                    className="w-full group flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-destructive/5 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                                >
                                    <Power size={18} className="group-hover:scale-110 transition-transform" /> End Match
                                </button>
                                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-start">
                                    <Activity size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-500">Scorer Tip</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Use the "Extras" tab for penalty runs. Updates are broadcast instantly.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* CASE 2: UPCOMING - Show Waiting Card */}
                        {liveScore.status === "upcoming" && (
                            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center text-center shadow-md">
                                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 ring-1 ring-border">
                                    <Clock className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Match Not Started</h3>
                                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                                    This match is scheduled but hasn't begun yet. Complete the toss and team selection to enable scoring controls.
                                </p>
                                <button 
                                    onClick={() => navigate(`/manager/match/${matchId}/dashboard`)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-all"
                                >
                                    Go to Match Setup <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* CASE 3: COMPLETED - Show Result Card */}
                        {(liveScore.status === "completed" || liveScore.status === "bye") && (
                            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center text-center shadow-md">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20">
                                    <Trophy className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Match Concluded</h3>
                                <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-[250px]">
                                    This match has officially ended. Controls are disabled to preserve the final scorecard.
                                </p>
                                <div className="w-full bg-muted/50 rounded-lg p-4 border border-border">
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">FINAL RESULT</span>
                                    <p className="text-foreground font-medium mt-1 text-sm">{liveScore?.result || `Match ${liveScore.status}`}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* === End Match Confirmation Modal === */}
            {showEndMatchConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-destructive">
                            <AlertTriangle size={24} />
                            <h3 className="text-lg font-bold text-foreground">End Match?</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">Are you sure you want to end this match? This action <strong>cannot be undone</strong>.</p>
                        
                        {/* 1. Reason Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Reason</label>
                                <select
                                    value={endReason}
                                    onChange={(e) => setEndReason(e.target.value as endReason)}
                                    className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="COMPLETED">Match Completed</option>
                                    <option value="RAIN">Rain Delay / Washout</option>
                                    <option value="BAD_LIGHT">Bad Light</option>
                                    <option value="FORCE_END">Force End</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* 2. Result Configuration (Only if Completed) */}
                            {endReason === 'COMPLETED' && (
                                <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Winner</label>
                                        <select
                                            value={winnerId}
                                            onChange={(e) => setWinnerId(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Select Winner...</option>
                                            <option value={teamA._id}>{teamA.name}</option>
                                            <option value={teamB._id}>{teamB.name}</option>
                                            <option value="TIE">Tie Match</option>
                                            <option value="DRAW">Draw</option>
                                        </select>
                                    </div>

                                    {/* Margin Inputs (Hidden if Tie/Draw) */}
                                    {winnerId && winnerId !== 'TIE' && winnerId !== 'DRAW' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Margin</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="e.g 10"
                                                    value={winMargin}
                                                    onChange={(e) => setWinMargin(e.target.value)}
                                                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Type</label>
                                                <select
                                                    value={winType}
                                                    onChange={(e) => setWinType(e.target.value as "runs" | "wickets")}
                                                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="runs">Runs</option>
                                                    <option value="wickets">Wickets</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowEndMatchConfirm(false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80">Cancel</button>
                            <button 
                                onClick={handleConfirmEndMatch} 
                                className="px-4 py-2 rounded-lg text-sm font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
                            >
                                Confirm End
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <StreamManager isOpen={isStreamDrawerOpen} onClose={() => setIsStreamDrawerOpen(false)} streamData={streamManagerData} />
        </div>
    );
};

export default ScoreboardDashboard;