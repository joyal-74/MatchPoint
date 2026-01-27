import { useState } from 'react';
import {
    Calendar, MapPin, Clock,
    CheckCircle2, PlayCircle, Timer,
    ExternalLink, Map
} from 'lucide-react';
import Navbar from '../../components/umpire/Navbar';

const UmpireMatchDashboard = () => {
    const [activeFilter, setActiveFilter] = useState('upcoming');

    const mockData = {
        ongoing: {
            id: 1, t1: "Wolves", t2: "Dragons", time: "14:00", date: "Jan 27",
            loc: "Pitch 1", type: "T20", venue: "National Turf Complex",
            score: "142/4 (16.2 ov)", currentTurn: "Dragons chasing 180"
        },
        others: [
            { id: 2, t1: "Strikers", t2: "Titans", time: "10:30", date: "Jan 28", loc: "Main Oval", status: "upcoming", type: "ODI" },
            { id: 3, t1: "Eagles", t2: "Panthers", time: "09:00", date: "Jan 15", loc: "Pitch 4", status: "completed", type: "T20" },
            { id: 4, t1: "Vipers", t2: "Hawks", time: "15:30", date: "Feb 02", loc: "West Ground", status: "upcoming", type: "Test" },
            { id: 5, t1: "Lions", t2: "Cobras", time: "11:00", date: "Jan 20", loc: "Pitch 2", status: "completed", type: "T20" },
            { id: 6, t1: "Bulls", t2: "Rhinos", time: "08:00", date: "Feb 05", loc: "Pitch 1", status: "upcoming", type: "T10" },
        ]
    };

    const filteredMatches = mockData.others.filter(m => m.status === activeFilter);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            
            <main className="mx-auto p-4 md:p-8 space-y-12">
                
                {/* --- SECTION 1: THE FEATURED ONGOING MATCH --- */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Match Session</h2>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] bg-card border border-border shadow-xl p-6 md:p-10 transition-all">
                        {/* Soft Theme-based Gradient Glow */}
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 blur-[100px] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                        {mockData.ongoing.type}
                                    </span>
                                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Map size={12} /> {mockData.ongoing.venue}
                                    </span>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-black border-2 border-primary shadow-inner">W</div>
                                        <p className="text-xs font-bold">{mockData.ongoing.t1}</p>
                                    </div>
                                    <span className="text-3xl font-black italic text-muted/30 tracking-tighter">VS</span>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-black border border-border">D</div>
                                        <p className="text-xs font-bold">{mockData.ongoing.t2}</p>
                                    </div>
                                </div>

                                <div className="space-y-1 pt-2">
                                    <h3 className="text-3xl font-black tracking-tighter">{mockData.ongoing.score}</h3>
                                    <p className="text-[11px] text-muted-foreground font-medium italic">{mockData.ongoing.currentTurn}</p>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-start md:items-end gap-6">
                                <div className="space-y-2 md:text-right">
                                    <div className="flex items-center md:justify-end gap-2 text-muted-foreground text-xs font-medium">
                                        <MapPin size={14} className="text-primary" /> {mockData.ongoing.loc}
                                    </div>
                                    <div className="flex items-center md:justify-end gap-2 text-muted-foreground text-xs font-medium">
                                        <Clock size={14} className="text-primary" /> Started at {mockData.ongoing.time}
                                    </div>
                                </div>
                                <button className="w-full md:w-auto px-10 py-4 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                                    Resume Scoring <PlayCircle size={18} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: MATCH LIBRARY --- */}
                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Match Library</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Review schedules and past results</p>
                        </div>

                        <div className="flex p-1 bg-muted rounded-full border border-border">
                            {['upcoming', 'completed'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeFilter === tab
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredMatches.map((m) => (
                            <div key={m.id} className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[9px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-widest border border-border">
                                        {m.type}
                                    </span>
                                    {m.status === 'completed' 
                                        ? <CheckCircle2 size={16} className="text-green-500/50" /> 
                                        : <Timer size={16} className="text-muted-foreground" />
                                    }
                                </div>

                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <span className="text-[12px] font-black uppercase tracking-tight">{m.t1}</span>
                                    <span className="text-[10px] font-black text-muted/40 italic">VS</span>
                                    <span className="text-[12px] font-black uppercase tracking-tight">{m.t2}</span>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                        <Calendar size={12} className="text-primary" /> {m.date} • {m.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                        <MapPin size={12} className="text-primary" /> {m.loc}
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-3 rounded-xl bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all flex items-center justify-center gap-2">
                                    View Details <ExternalLink size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UmpireMatchDashboard;