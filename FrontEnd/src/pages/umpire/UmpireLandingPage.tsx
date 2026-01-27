import {
    Zap, ShieldCheck, BarChart3, ChevronRight,
    MapPin,ArrowRight, Activity,
    Users, Layers,
    Clock
} from 'lucide-react';
import Navbar from '../../components/umpire/Navbar';

const UmpireLandingPage = () => {
    const matches = [
        { t1: "Wolves", t2: "Dragons", time: "14:00", date: "Today", loc: "Pitch 1", badge: "Live Soon", type: "T20" },
        { t1: "Strikers", t2: "Titans", time: "10:30", date: "Jan 28", loc: "Main Oval", badge: "Confirmed", type: "ODI" },
        { t1: "Eagles", t2: "Panthers", time: "09:00", date: "Jan 30", loc: "Pitch 4", badge: "Pending", type: "T20" },
        { t1: "Vipers", t2: "Hawks", time: "15:30", date: "Feb 02", loc: "West Ground", badge: "Confirmed", type: "Test" },
    ];
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background text-slate-200 selection:bg-primary/20">

                {/* Subtle Ambient Glow */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/5 blur-[100px] pointer-events-none" />

                {/* --- 1. HERO SECTION --- */}
                <section className="relative py-30 px-6">
                    <div className="max-w-5xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Pro-League Certified</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                            Precision officiating for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">modern cricket.</span>
                        </h1>

                        <p className="max-w-xl mx-auto text-sm md:text-base text-slate-400 font-medium leading-relaxed">
                            A streamlined interface for match officials. Handle ball-by-ball scoring,
                            DLS calculations, and match reports in one cohesive workspace.
                        </p>

                        <div className="flex flex-row justify-center gap-3 pt-4">
                            <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all flex items-center gap-2">
                                Get Started <ArrowRight size={16} />
                            </button>
                            <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-sm font-bold rounded-full hover:bg-white/10 transition-all">
                                Live Demo
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- 2. FEATURE TILES --- */}
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[
                                {
                                    icon: <Zap size={20} />,
                                    title: "Live Scoring",
                                    desc: "Real-time ball entry with intuitive 'Extras' handling."
                                },
                                {
                                    icon: <Layers size={20} />,
                                    title: "Automated DLS",
                                    desc: "Instant rain-affected target adjustments built-in."
                                },
                                {
                                    icon: <ShieldCheck size={20} />,
                                    title: "Report Vault",
                                    desc: "Digital match reports signed and sent instantly."
                                },
                                {
                                    icon: <Activity size={20} />,
                                    title: "Performance",
                                    desc: "Track decision accuracy and game time efficiency."
                                },
                                {
                                    icon: <Users size={20} />,
                                    title: "Team Sync",
                                    desc: "Auto-fetch playing XIs and substitute details."
                                },
                                {
                                    icon: <BarChart3 size={20} />,
                                    title: "Analytics",
                                    desc: "Visual heatmaps of scoring patterns and dismissals."
                                }
                            ].map((f, i) => (
                                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                                        {f.icon}
                                    </div>
                                    <h4 className="text-base font-bold text-white mb-2">{f.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 3. MY MATCHES (COMPACT) --- */}
                <section className="py-16 px-6 bg-white/[0.01]">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="flex items-end justify-between mb-10">
                            <div className="space-y-1">
                                <h2 className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Duty Roster</h2>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Upcoming Assignments</h3>
                            </div>
                            <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                                View Schedule <ChevronRight size={14} />
                            </button>
                        </div>

                        {/* 4-Card Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {matches.map((m, i) => (
                                <div
                                    key={i}
                                    className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300 cursor-pointer"
                                >
                                    {/* Card Header: Type & Status */}
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[10px] font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider">
                                            {m.type}
                                        </span>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${m.badge === 'Live Soon' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {m.badge}
                                        </span>
                                    </div>

                                    {/* Team Matchup */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col items-center gap-1 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:border-primary/50 transition-colors">
                                                {m.t1[0]}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-300">{m.t1}</span>
                                        </div>

                                        <span className="text-[10px] font-black text-slate-600 italic px-2">VS</span>

                                        <div className="flex flex-col items-center gap-1 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:border-primary/50 transition-colors">
                                                {m.t2[0]}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-300">{m.t2}</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-[1px] w-full bg-white/5 mb-4" />

                                    {/* Card Footer: Time & Place */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={12} className="text-primary/70" />
                                            <span className="text-[11px] font-medium">{m.date}, {m.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin size={12} className="text-primary/70" />
                                            <span className="text-[11px] font-medium">{m.loc}</span>
                                        </div>
                                    </div>

                                    {/* Action Indicator */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <ChevronRight size={16} className="text-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 4. MINI FOOTER --- */}
                <footer className="py-12 px-6 border-t border-white/5">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center font-black italic text-[10px] text-primary-foreground">U</div>
                            <span className="text-sm font-bold text-white tracking-tighter uppercase">UmpirePro</span>
                        </div>
                        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-wider">
                            <a href="#" className="hover:text-primary transition-colors">Safety</a>
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        </div>
                        <p className="text-[11px]">© 2026 Umpire Dashboard.</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default UmpireLandingPage;