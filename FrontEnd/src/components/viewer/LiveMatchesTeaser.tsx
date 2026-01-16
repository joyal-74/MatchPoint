import { useNavigate } from "react-router-dom";
import { ArrowRight, Activity, Wifi } from "lucide-react";

const LiveMatchesTeaser = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
            
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl -z-10" />
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
                
                {/* Live Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 mb-6 animate-pulse">
                    <Wifi size={14} className="animate-ping absolute opacity-75" />
                    <Wifi size={14} className="relative" />
                    <span className="text-xs font-bold uppercase tracking-widest">Happening Now</span>
                </div>

                {/* Main Heading */}
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                    Don't Miss the <span className="text-primary">Action.</span>
                </h2>

                {/* Description */}
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Dive into the arena with real-time scores, play-by-play highlights, and instant alerts. 
                    From local derbies to championship finals, catch every moment as it unfolds.
                </p>

                {/* Action Button */}
                <button
                    onClick={() => navigate('/live')}
                    className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1 active:scale-95"
                >
                    <Activity size={20} className="animate-pulse" />
                    <span>Explore Live Matches</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {/* Footer Note */}
                <p className="mt-8 text-sm text-muted-foreground/60">
                    *Real-time updates available for supported leagues and tournaments.
                </p>
            </div>
        </section>
    );
};

export default LiveMatchesTeaser;