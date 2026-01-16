import { useState, useEffect } from "react";
import { 
    MapPin, Banknote, Swords, AlertTriangle, Ban, 
    Navigation, Calendar, Clock, ArrowRight, Sparkles 
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { Tournament } from "../../../../../features/manager/managerTypes";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

// Leaflet Icon Fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useAppDispatch } from "../../../../../hooks/hooks";
import { startTournament } from "../../../../../features/manager";
import { cancelTournament } from "../../../../../features/manager/Tournaments/tournamentThunks";
import ConfirmModal from "../../../../shared/modal/ConfirmModal";
import { useNavigate } from "react-router-dom";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24, 36],
    iconAnchor: [12, 36]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- HOOKS ---
const useThemeObserver = () => {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    return isDark;
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// --- SUB-COMPONENTS ---

const TimelineItem = ({ date, label, isActive, isPast }: { date: string, label: string, isActive?: boolean, isPast?: boolean }) => (
    <div className="flex items-start gap-4 relative z-10 group">
        {/* Dot with opacity ring */}
        <div className={`w-3 h-3 mt-1.5 rounded-full ring-4 transition-all duration-300 ${isActive ? 'bg-primary ring-primary/20 animate-pulse' : isPast ? 'bg-primary/60 ring-transparent' : 'bg-muted-foreground/30 ring-transparent'}`} />

        <div className={`${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} transition-opacity`}>
            <p className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{label}</p>
            <p className="text-sm font-bold text-foreground">{formatDate(date)}</p>
        </div>
    </div>
);

interface InfoTabProps {
    tournamentData: Tournament;
}

export default function InfoTab({ tournamentData }: InfoTabProps) {
    const isDark = useThemeObserver();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Actions State
    const [isStarting, setIsStarting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);

    // Logic
    const canStart = tournamentData.currTeams >= tournamentData.minTeams;
    const isUpcoming = tournamentData.status === 'upcoming';
    const now = new Date();
    const regPassed = now > new Date(tournamentData.regDeadline);
    const startPassed = now > new Date(tournamentData.startDate);

    // Map Config
    const lat = tournamentData.latitude || 9.9312;
    const lng = tournamentData.longitude || 76.2673;
    const lightTiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    // --- HANDLERS ---
    const handleStart = async () => {
        if (!canStart) return toast.error(`Need ${tournamentData.minTeams} teams min.`);
        setIsStarting(true);
        try {
            await dispatch(startTournament(tournamentData._id)).unwrap();
            toast.success("Tournament started successfully!");
        } catch (error) {
            console.log(error)
            toast.error("Failed to start tournament");
        } finally {
            setIsStarting(false);
        }
    };

    const handleCancelClick = () => {
        setCancelModalOpen(true);
    };

    const handleConfirmCancel = async (reason: string) => {
        setCancelModalOpen(false);
        setIsCancelling(true);
        try {
            await dispatch(cancelTournament({ cancelId: tournamentData._id, reason })).unwrap();
            toast.success("Tournament cancelled.");
            navigate('/manager/tournaments');
        } catch (error) {
            console.log(error)
            toast.error("Failed to cancel tournament");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="w-full mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 relative">

            {/* ================= 1. GLASS HERO BANNER ================= */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-6 md:p-8 z-0">
                {/* Subtle Background Glow Blob - Pushed to back with z-0 and parent relative */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none z-0" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Main Prize Pool */}
                    <div className="md:col-span-1 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/10 backdrop-blur-sm">
                            <Sparkles size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Total Prize Pool</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                            <span className="text-primary">₹</span>{tournamentData.prizePool.toLocaleString()}
                        </h2>
                    </div>

                    {/* Secondary Stats */}
                    <div className="md:col-span-2 flex flex-wrap items-center gap-6 md:gap-12 md:justify-end">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Banknote size={20} />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-muted-foreground uppercase">Entry Fee</span>
                                <span className="text-xl font-bold text-foreground">₹{tournamentData.entryFee}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Swords size={20} />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-muted-foreground uppercase">Format</span>
                                <span className="text-xl font-bold text-foreground capitalize">{tournamentData.format}</span>
                            </div>
                        </div>

                        <div className="pl-6 border-l border-primary/10">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${tournamentData.status === 'upcoming' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                'bg-muted text-muted-foreground border-border'
                                }`}>
                                {tournamentData.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= 2. MAIN CONTENT GRID ================= */}
            {/* Set z-0 to ensure grid content creates a base context */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative z-0">

                {/* --- LEFT: MAP & DETAILS --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Map Section */}
                    <div className="rounded-3xl border border-border/60 overflow-hidden bg-card/50 shadow-sm relative group z-0">
                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 transition-all duration-500 rounded-3xl pointer-events-none z-10" />

                        <div className="px-5 py-4 flex justify-between items-center border-b border-border/40 bg-muted/20 relative z-20">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-foreground/80">
                                <MapPin size={16} className="text-primary/80" /> Venue Map
                            </h3>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                            >
                                Open in Maps <Navigation size={10} />
                            </a>
                        </div>

                        <div className="relative w-full h-72 isolate">
                            {/* Map Container - Isolate Z-Index */}
                            <MapContainer
                                key={isDark ? 'dark-v4' : 'light-v4'}
                                center={[lat, lng]}
                                zoom={13}
                                zoomControl={false}
                                // Ensure Map is at z-0 so overlays can sit on top
                                className="h-full w-full z-0 opacity-90 hover:opacity-100 transition-opacity duration-500"
                            >
                                <TileLayer url={isDark ? darkTiles : lightTiles} />
                                <Marker position={[lat, lng]} />
                            </MapContainer>

                            {/* Glass Overlay on Map - Z-Index 400 to sit above map but below modals */}
                            <div className="absolute bottom-4 left-4 bg-background/60 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg z-[400] max-w-[260px]">
                                <p className="text-[10px] font-bold text-primary/80 uppercase mb-0.5">Location</p>
                                <p className="text-sm font-bold leading-tight line-clamp-2">{tournamentData.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-3xl p-6">
                        <h4 className="text-sm font-bold text-foreground mb-3 opacity-80">Overview</h4>
                        <p className="text-sm text-muted-foreground leading-7">
                            {tournamentData.description || "No specific description provided by the organizer."}
                        </p>
                    </div>
                </div>

                {/* --- RIGHT: TIMELINE & ACTIONS --- */}
                <div className="lg:col-span-1 space-y-6 sticky top-6 z-10">

                    {/* Timeline */}
                    <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-3xl p-6 relative">
                        <h4 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2 opacity-80">
                            <Calendar size={16} className="text-primary" /> Schedule
                        </h4>

                        <div className="relative space-y-8 pl-2">
                            {/* Vertical Line - Z-0 */}
                            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-foreground/5 z-0" />
                            <TimelineItem
                                date={tournamentData.regDeadline as string}
                                label="Registration Ends"
                                isPast={regPassed}
                                isActive={!regPassed && isUpcoming}
                            />
                            <TimelineItem
                                date={tournamentData.startDate}
                                label="Tournament Starts"
                                isPast={startPassed}
                                isActive={regPassed && !startPassed && isUpcoming}
                            />
                            <TimelineItem
                                date={tournamentData.endDate}
                                label="Conclusion"
                            />
                        </div>
                    </div>

                    {/* Action Block */}
                    {isUpcoming && (
                        <div className="bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-5 space-y-4 shadow-sm relative z-20">

                            <div className={`rounded-2xl p-3 flex items-start gap-3 border ${canStart ? 'bg-green-500/5 border-green-500/10 text-green-700 dark:text-green-400' : 'bg-orange-500/5 border-orange-500/10 text-orange-700 dark:text-orange-400'}`}>
                                {canStart ? <Clock size={18} className="mt-0.5" /> : <AlertTriangle size={18} className="mt-0.5" />}
                                <div>
                                    <p className="text-xs font-bold uppercase mb-0.5">{canStart ? "Ready to Launch" : "Action Required"}</p>
                                    {!canStart && <p className="text-[11px] opacity-80">Waiting for {tournamentData.minTeams - tournamentData.currTeams} teams</p>}
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                disabled={!canStart || isStarting || isCancelling}
                                className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${canStart
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                                    : 'bg-muted/50 text-muted-foreground border border-border/50 cursor-not-allowed'
                                    }`}
                            >
                                {isStarting ? "Starting..." : <>Start Tournament <ArrowRight size={16} /></>}
                            </button>

                            <button
                                onClick={handleCancelClick}
                                disabled={isStarting || isCancelling}
                                className="w-full py-3 rounded-xl border border-border/50 bg-background/50 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all text-xs font-bold flex items-center justify-center gap-2 text-muted-foreground">
                                {isCancelling ? "Cancelling..." : <><Ban size={14} /> Cancel Event</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= MOVED MODAL OUTSIDE ================= 
                Moving the modal to the root of the component ensures it isn't 
                affected by the 'sticky' or 'grid' stacking contexts. 
                Ideally, modals should use React Portals, but this fixes the 
                immediate z-index clash.
            */}
            <ConfirmModal
                isOpen={isCancelModalOpen}
                title="Cancel Tournament?"
                message="This action cannot be undone. Are you sure you want to cancel this tournament?"
                onConfirm={handleConfirmCancel}
                onCancel={() => setCancelModalOpen(false)}
                confirmText="Yes, Cancel Event"
                reasons={[
                    "Not enough teams registered",
                    "Scheduling conflicts",
                    "Venue issues",
                    "Weather conditions",
                    "Other"
                ]}
            />
        </div>
    );
}