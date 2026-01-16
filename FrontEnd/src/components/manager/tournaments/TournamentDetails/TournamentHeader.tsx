import { Trophy, Calendar, Share2, Edit3, Ticket, CheckCircle2, Users, MapPin } from "lucide-react";
import type { Tournament } from "../../../../features/manager/managerTypes";

interface TournamentHeaderProps {
    tournamentData: Tournament;
    type: "manage" | "explore";
    onClick?: () => void;
    onBack?: () => void;
    isRegistered?: boolean;
}

export default function TournamentHeader({ tournamentData, type, onClick, isRegistered }: TournamentHeaderProps) {

    const isCompleted = tournamentData.status === "completed";

    // Formatting
    const startDate = new Date(tournamentData.startDate);
    const endDate = new Date(tournamentData.endDate);
    const dateRange = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return (
        // A self-contained, rounded "Hero Card" that fits inside your layout
        <div className="w-full relative bg-card border border-border rounded-3xl overflow-hidden shadow-sm group my-4">

            {/* ================= 1. BACKGROUND BANNER LAYER ================= */}
            <div className="absolute inset-0 z-0 h-full w-full bg-muted/20">
                {tournamentData.banner ? (
                    <img
                        src={tournamentData.banner as string}
                        alt="Tournament Banner"
                        className="w-full h-full object-cover opacity-30 dark:opacity-20 blur-[1px] transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    // Fallback Pattern
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                )}

                {/* Gradient Overlay: Left-to-Right for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
                {/* Gradient Overlay: Bottom-to-Top to blend with card footer */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            {/* ================= 2. CONTENT LAYER ================= */}
            <div className="relative z-10 p-6 md:p-8">

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

                    {/* --- LEFT SIDE: INFO --- */}
                    <div className="flex-1 space-y-5">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-90">
                                <Trophy size={14} />
                                <span>{tournamentData.sport} Series</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[0.95]">
                                {tournamentData.title}
                            </h1>
                        </div>

                        {/* Stats Row (Glass Cards) */}
                        <div className="flex flex-wrap items-center gap-3">
                            <GlassStat icon={Calendar} label={dateRange} />
                            <GlassStat icon={Users} label={`${tournamentData.currTeams} / ${tournamentData.maxTeams} Teams`} />
                            <GlassStat icon={MapPin} label={tournamentData.location || "Online"} />
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: ACTIONS --- */}
                    <div className="flex items-center gap-3 pb-1">
                        <button className="h-12 w-12 rounded-2xl bg-background/40 hover:bg-background/80 border border-border/50 text-muted-foreground hover:text-foreground backdrop-blur-md transition-all flex items-center justify-center">
                            <Share2 size={20} />
                        </button>

                        {type === "manage" ? (
                            <button
                                onClick={onClick}
                                className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                            >
                                <Edit3 size={18} />
                                <span>Manage</span>
                            </button>
                        ) : (
                            <>
                                {isRegistered ? (
                                    <div className="h-12 px-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 font-bold text-sm flex items-center gap-2 backdrop-blur-md">
                                        <CheckCircle2 size={20} />
                                        <span>Registered</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onClick}
                                        disabled={isCompleted}
                                        className={`h-12 px-8 rounded-2xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 ${isCompleted
                                                ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                                                : "bg-foreground text-background hover:bg-foreground/90 shadow-foreground/10"
                                            }`}
                                    >
                                        <Ticket size={18} className="stroke-[2.5px]" />
                                        <span>{isCompleted ? "Closed" : "Register Team"}</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for cleaner code
function GlassStat({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/40 border border-border/40 backdrop-blur-sm text-xs font-medium text-foreground/90">
            <Icon size={14} className="text-muted-foreground" />
            {label}
        </div>
    );
}