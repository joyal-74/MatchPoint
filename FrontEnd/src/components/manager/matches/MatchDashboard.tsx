import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { loadMatchDashboard, saveMatchData } from "../../../features/manager/Matches/matchThunks";
import { fetchUserPlan } from "../../../features/shared/subscription/subscriptionThunks"; 
import { Trophy, ChevronRight, ChevronLeft, Tv, Save,
    Lock, ArrowUpCircle, Users, MapPin, Calendar, Activity, CheckCircle2
} from "lucide-react";
import Navbar from "../Navbar";
import LoadingOverlay from "../../shared/LoadingOverlay";
import toast from "react-hot-toast";

const MatchDashboard = () => {
    const { matchId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { match, teamA, teamB, loading: matchLoading } = useAppSelector((state) => state.match);
    const { userSubscription, loading: planLoading } = useAppSelector((state) => state.userSubscription);

    console.log(match)
    const { user } = useAppSelector((state) => state.auth);

    const [currentStep, setCurrentStep] = useState(1);
    const [tossWinnerId, setTossWinnerId] = useState("");
    const [tossDecision, setTossDecision] = useState("");

    useEffect(() => {
        if (matchId) dispatch(loadMatchDashboard(matchId));
        if (user?._id) dispatch(fetchUserPlan({ userId: user._id }));
    }, [matchId, user?._id, dispatch]);

    // SYNC SAVED DATA ON RELOAD
    useEffect(() => {
        if (match?.tossWinner) {
            setTossWinnerId(match.tossWinner);
            // If toss is already saved, we might want to default the user to Step 2
            setCurrentStep(2); 
        }
        if (match?.tossDecision) {
            setTossDecision(match.tossDecision.toUpperCase());
        }
    }, [match]);

    const canStream = userSubscription?.level === "Super" || userSubscription?.level === "Premium";
    const isTossSaved = !!match?.tossWinner && !!match?.tossDecision;

    const handleSaveDetails = async () => {
        if (!tossWinnerId || !tossDecision) {
            toast.error("Please select toss winner and decision");
            return;
        }
        try {
            await dispatch(saveMatchData({ matchId: matchId!, tossWinnerId, tossDecision })).unwrap();
            toast.success("Toss details saved successfully!");
        } catch (error) {
            console.log(error)
            toast.error("Failed to save match details");
        }
    };

    if (matchLoading || planLoading) return <LoadingOverlay show={true} />;
    if (!match) return <div className="p-20 text-center">Match not found.</div>;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col pt-10 pb-32 px-6 max-w-[1400px] mx-auto w-full">
                
                {/* MATCH HEADER */}
                <header className="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <Activity size={14} className="animate-pulse" /> Match Command Center
                        </p>
                        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
                            {teamA?.name} <span className="text-muted-foreground/30 text-2xl font-light italic">vs</span> {teamB?.name}
                        </h1>
                    </div>
                    
                    <div className="flex gap-6 text-muted-foreground">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Venue</span>
                            <span className="text-sm font-semibold flex items-center gap-1.5"><MapPin size={14}/> {match?.venue || "Main Stadium"}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Match Date</span>
                            <span className="text-sm font-semibold flex items-center gap-1.5"><Calendar size={14}/> {match?.date ? new Date(match.date).toLocaleDateString() : 'TBD'}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {currentStep === 1 ? (
                        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
                                {[teamA, teamB].map((team, idx) => (
                                    <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm group hover:border-primary/30 transition-all">
                                        <div className="bg-muted/30 px-5 py-4 border-b border-border flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {team?.name?.charAt(0)}
                                                </div>
                                                <span className="font-black text-sm tracking-tight uppercase">{team?.name}</span>
                                            </div>
                                            <Users size={16} className="text-muted-foreground opacity-40" />
                                        </div>
                                        <div className="p-5 grid grid-cols-1 gap-1 text-sm">
                                            {team?.members?.map((player, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-secondary/80 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-mono opacity-30 w-4">{String(i + 1).padStart(2, '0')}</span>
                                                        <span className="font-bold tracking-tight">{typeof player === 'object' ? player.name : player}</span>
                                                    </div>
                                                    <span className="text-[9px] font-black text-primary/40 uppercase">Player</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                                    <h4 className="text-xs font-black uppercase mb-4 tracking-widest text-primary">Pre-Match Intel</h4>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            <p className="text-xs leading-relaxed text-muted-foreground">Verify all 11 players for both teams before proceeding to the toss.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            <p className="text-xs leading-relaxed text-muted-foreground">Match scoring is handled by the <b>Appointed Umpire</b>.</p>
                                        </li>
                                    </ul>
                                </div>
                                {isTossSaved && (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4">
                                        <CheckCircle2 className="text-green-500" size={24} />
                                        <div>
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Saved Status</p>
                                            <p className="text-xs font-bold text-green-700">Toss details are already synced.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-500">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Trophy size={120} />
                                    </div>
                                    
                                    <h3 className="text-xs font-black uppercase mb-8 flex items-center gap-2 text-primary tracking-[0.2em]">
                                        <Trophy size={16} /> Toss Management
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Winning Team</label>
                                            <select
                                                value={tossWinnerId}
                                                onChange={(e) => setTossWinnerId(e.target.value)}
                                                className="w-full bg-background border-2 border-border p-4 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all appearance-none"
                                            >
                                                <option value="">Select Team</option>
                                                <option value={teamA?._id}>{teamA?.name}</option>
                                                <option value={teamB?._id}>{teamB?.name}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Elected To</label>
                                            <div className="flex p-1.5 bg-muted rounded-2xl gap-1.5">
                                                <button onClick={() => setTossDecision("BAT")} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${tossDecision === "BAT" ? "bg-background text-primary shadow-md" : "text-muted-foreground hover:bg-background/50"}`}> BAT </button>
                                                <button onClick={() => setTossDecision("BOWL")} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${tossDecision === "BOWL" ? "bg-background text-primary shadow-md" : "text-muted-foreground hover:bg-background/50"}`}> BOWL </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleSaveDetails} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                                        <Save size={18} /> {isTossSaved ? "Update Toss Details" : "Finalize & Initialize Match"}
                                    </button>
                                </div>

                                {isTossSaved && (
                                     <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Current Saved Result</p>
                                        <p className="text-xl font-black italic">
                                            {match?.tossWinner === teamA?._id ? teamA?.name : teamB?.name} won the toss and elected to {match?.tossDecision}!
                                        </p>
                                     </div>
                                )}
                            </div>

                            <div className="lg:col-span-5 space-y-6">
                                <div className={`border-2 rounded-3xl p-8 flex flex-col items-center text-center transition-all ${canStream ? "bg-card border-primary/20 shadow-xl shadow-primary/5" : "bg-muted/40 border-dashed border-border"}`}>
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${canStream ? "bg-primary text-white shadow-2xl shadow-primary/40" : "bg-muted-foreground/10 text-muted-foreground"}`}>
                                        {canStream ? <Tv size={32} /> : <Lock size={32} />}
                                    </div>
                                    
                                    <h3 className="font-black text-xl tracking-tight mb-2">Broadcaster Studio</h3>
                                    <p className="text-xs text-muted-foreground mb-8 px-4 leading-relaxed">
                                        Manage your RTMP streams, overlays, and production quality from the specialized streamer dashboard.
                                    </p>
                                    
                                    {canStream ? (
                                        <button onClick={() => navigate(`/manager/match/${matchId}/stream`)} className="w-full py-4 bg-foreground text-background rounded-2xl text-xs font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all group">
                                            LAUNCH STREAMER DASHBOARD <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                                        </button>
                                    ) : (
                                        <div className="w-full space-y-4">
                                            <div className="bg-background/60 p-4 rounded-2xl border border-border">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                                                    Broadcast requires <span className="text-primary">Super</span> or <span className="text-primary">Premium</span>
                                                </p>
                                            </div>
                                            <button onClick={() => navigate('/pricing')} className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                <ArrowUpCircle size={18} /> UPGRADE NOW
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${isTossSaved ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
                                        <span className="text-xs font-black uppercase tracking-widest">Umpire Portal</span>
                                    </div>
                                    <span className="text-[10px] font-bold py-1 px-3 bg-muted rounded-full text-muted-foreground">
                                        {isTossSaved ? "LIVE SCORING READY" : "WAITING FOR TOSS"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Sticky Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-5 z-50">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6">
                    <button 
                        disabled={currentStep === 1} 
                        onClick={() => setCurrentStep(1)} 
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-0 transition-all"
                    >
                        <ChevronLeft size={18} /> Previous Step
                    </button>
                    
                    {currentStep === 1 ? (
                        <button onClick={() => setCurrentStep(2)} className="flex items-center gap-3 px-10 py-4 bg-foreground text-background rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 shadow-2xl transition-all active:scale-95 group">
                            Next: Setup Match <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            Step 2 of 2: Deployment
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default MatchDashboard;