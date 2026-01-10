/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trophy, Calendar, MapPin, ScrollText, Banknote, Swords, Clock, AlertCircle, ChevronRight } from "lucide-react";
import TournamentStats from "../shared/TournamentStats";
import type { Tournament } from "../../../../../features/manager/managerTypes";
import MapDetails from "../shared/MapDetails";

interface InfoTabProps {
    tournamentData: Tournament;
    registeredTeams: any;
}

export default function InfoTab({ tournamentData }: InfoTabProps) {
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className="flex flex-col gap-6 max-w-full">
            
            {/* ROW 1: High-Level Metrics (Bento Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Prize Pool - Featured (Theme Primary Color) */}
                <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-card border border-primary/20 p-6 group">
                    <div className="absolute right-0 top-0 p-32 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Trophy size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Prize Pool</span>
                        </div>
                        <div>
                            <span className="text-4xl md:text-5xl font-black text-foreground tracking-tight">{tournamentData.prizePool}</span>
                            <p className="text-primary/80 text-sm font-medium mt-1">Total wincash</p>
                        </div>
                    </div>
                </div>

                {/* Metric 2: Entry Fee */}
                <div className="relative rounded-2xl bg-card border border-border p-6 flex flex-col justify-between hover:border-green-500/50 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Entry</span>
                        {/* Using Green specifically for Money semantic */}
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                            <Banknote size={20} />
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-foreground">{tournamentData.entryFee}</span>
                        <p className="text-muted-foreground text-xs mt-1">Per team registration</p>
                    </div>
                </div>

                {/* Metric 3: Format */}
                <div className="relative rounded-2xl bg-card border border-border p-6 flex flex-col justify-between hover:border-blue-500/50 transition-colors group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Format</span>
                        {/* Using Blue specifically for Info semantic */}
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Swords size={20} />
                        </div>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-foreground capitalize">{tournamentData.format}</span>
                        <p className="text-muted-foreground text-xs mt-1">Tournament Structure</p>
                    </div>
                </div>
            </div>

            {/* ROW 2: Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT: Context & Timeline (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* Description Block */}
                    <div className="rounded-2xl bg-card border border-border p-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Tournament Brief</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {tournamentData.description || "No specific description provided by the organizer."}
                        </p>
                    </div>

                    {/* Split: Timeline & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timeline Card */}
                        <div className="rounded-2xl bg-card border border-border p-6 flex flex-col">
                            <div className="flex items-center gap-2 mb-6 text-foreground/80">
                                <Calendar size={18} className="text-primary" />
                                <span className="font-semibold">Schedule</span>
                            </div>
                            
                            <div className="space-y-0 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />

                                <div className="relative flex items-center gap-4 pb-6">
                                    <div className="relative z-10 w-4 h-4 rounded-full bg-card border-2 border-muted-foreground" />
                                    <div className="flex-1 p-3 rounded-xl bg-muted/50 border border-border">
                                        <p className="text-xs text-muted-foreground font-bold uppercase">Registration Ends</p>
                                        <p className="text-foreground font-medium">{formatDate(tournamentData.endDate)}</p>
                                    </div>
                                </div>

                                <div className="relative flex items-center gap-4">
                                    <div className="relative z-10 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/40" />
                                    <div className="flex-1 p-3 rounded-xl bg-primary/10 border border-primary/20">
                                        <p className="text-xs text-primary font-bold uppercase">Tournament Starts</p>
                                        <p className="text-foreground font-medium">{formatDate(tournamentData.startDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="rounded-2xl bg-card border border-border p-6 flex flex-col">
                             <div className="flex items-center gap-2 mb-6 text-foreground/80">
                                <MapPin size={18} className="text-destructive" />
                                <span className="font-semibold">Venue</span>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <MapDetails
                                    label=""
                                    location={tournamentData.location}
                                    longitude={tournamentData.longitude}
                                    latitude={tournamentData.latitude}
                                    icon={<></>}
                                />
                                <div className="mt-4 pt-4 border-t border-border">
                                    <button className="w-full py-2 text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        Open in Maps <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Stats & Rules (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Stats Widget Wrapper */}
                    <div className="rounded-2xl bg-card border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/30">
                            <span className="text-sm font-semibold text-foreground">Live Insights</span>
                        </div>
                        <div className="p-4">
                            <TournamentStats tournamentData={tournamentData} />
                        </div>
                    </div>

                    {/* Compact Rules Section */}
                    <div className="rounded-2xl bg-card border border-border flex flex-col flex-1">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ScrollText size={16} className="text-blue-500" />
                                <span className="text-sm font-semibold text-foreground">Rulebook</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{tournamentData.rules.length} Items</span>
                        </div>
                        
                        <div className="p-2 space-y-1">
                            {tournamentData.rules.map((rule, idx) => (
                                <div key={idx} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                                    <span className="font-mono text-xs text-muted-foreground group-hover:text-primary pt-0.5">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                                        {rule}
                                    </p>
                                </div>
                            ))}
                            {tournamentData.rules.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                                    <AlertCircle size={24} className="opacity-50" />
                                    No rules defined yet.
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-auto p-4 border-t border-border">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                                <Clock size={14} />
                                Last updated: 2 days ago
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}