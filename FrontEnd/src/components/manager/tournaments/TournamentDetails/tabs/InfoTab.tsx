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
                
                {/* Metric 1: Prize Pool - Featured */}
                <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/20 to-neutral-900 border border-amber-500/20 p-6 group">
                    <div className="absolute right-0 top-0 p-32 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <Trophy size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Prize Pool</span>
                        </div>
                        <div>
                            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{tournamentData.prizePool}</span>
                            <p className="text-amber-500/60 text-sm font-medium mt-1">Total wincash</p>
                        </div>
                    </div>
                </div>

                {/* Metric 2: Entry Fee */}
                <div className="relative rounded-2xl bg-neutral-900/50 border border-white/5 p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Entry</span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Banknote size={20} />
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-white">{tournamentData.entryFee}</span>
                        <p className="text-neutral-500 text-xs mt-1">Per team registration</p>
                    </div>
                </div>

                {/* Metric 3: Format */}
                <div className="relative rounded-2xl bg-neutral-900/50 border border-white/5 p-6 flex flex-col justify-between hover:border-blue-500/30 transition-colors group">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Format</span>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                            <Swords size={20} />
                        </div>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-white capitalize">{tournamentData.format}</span>
                        <p className="text-neutral-500 text-xs mt-1">Tournament Structure</p>
                    </div>
                </div>
            </div>

            {/* ROW 2: Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT: Context & Timeline (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* Description Block */}
                    <div className="rounded-2xl bg-neutral-900 border border-white/5 p-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Tournament Brief</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            {tournamentData.description || "No specific description provided by the organizer."}
                        </p>
                    </div>

                    {/* Split: Timeline & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timeline Card */}
                        <div className="rounded-2xl bg-neutral-900 border border-white/5 p-6 flex flex-col">
                            <div className="flex items-center gap-2 mb-6 text-neutral-200">
                                <Calendar size={18} className="text-purple-400" />
                                <span className="font-semibold">Schedule</span>
                            </div>
                            
                            <div className="space-y-0 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-neutral-800" />

                                <div className="relative flex items-center gap-4 pb-6">
                                    <div className="relative z-10 w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-600" />
                                    <div className="flex-1 p-3 rounded-xl bg-neutral-800/30 border border-white/5">
                                        <p className="text-xs text-neutral-500 font-bold uppercase">Registration Ends</p>
                                        <p className="text-white font-medium">{formatDate(tournamentData.endDate)}</p>
                                    </div>
                                </div>

                                <div className="relative flex items-center gap-4">
                                    <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <div className="flex-1 p-3 rounded-xl bg-emerald-900/10 border border-emerald-500/20">
                                        <p className="text-xs text-emerald-500 font-bold uppercase">Tournament Starts</p>
                                        <p className="text-white font-medium">{formatDate(tournamentData.startDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="rounded-2xl bg-neutral-900 border border-white/5 p-6 flex flex-col">
                             <div className="flex items-center gap-2 mb-6 text-neutral-200">
                                <MapPin size={18} className="text-red-400" />
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
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <button className="w-full py-2 text-xs font-medium text-neutral-400 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-2">
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
                    <div className="rounded-2xl bg-neutral-900 border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-neutral-800/30">
                            <span className="text-sm font-semibold text-white">Live Insights</span>
                        </div>
                        <div className="p-4">
                            <TournamentStats tournamentData={tournamentData} />
                        </div>
                    </div>

                    {/* Compact Rules Section */}
                    <div className="rounded-2xl bg-neutral-900 border border-white/5 flex flex-col flex-1">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ScrollText size={16} className="text-blue-400" />
                                <span className="text-sm font-semibold text-white">Rulebook</span>
                            </div>
                            <span className="text-xs text-neutral-500">{tournamentData.rules.length} Items</span>
                        </div>
                        
                        <div className="p-2 space-y-1">
                            {tournamentData.rules.map((rule, idx) => (
                                <div key={idx} className="flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                                    <span className="font-mono text-xs text-neutral-600 group-hover:text-emerald-500 pt-0.5">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <p className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors line-clamp-2">
                                        {rule}
                                    </p>
                                </div>
                            ))}
                            {tournamentData.rules.length === 0 && (
                                <div className="p-8 text-center text-neutral-500 text-sm flex flex-col items-center gap-2">
                                    <AlertCircle size={24} className="opacity-50" />
                                    No rules defined yet.
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-auto p-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-800/50 p-3 rounded-lg border border-white/5">
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