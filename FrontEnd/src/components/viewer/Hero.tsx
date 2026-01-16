import { Trophy, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-22 pb-20 md:pt-28 md:pb-32 px-4 overflow-hidden bg-background">
            
            {/* Background Ambience */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
            
            <div className="max-w-5xl mx-auto text-center space-y-8">
                
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    The Ultimate Sports Platform
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700">
                    Master Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        Tournament Arena
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700">
                    Effortlessly organize competitions, track live matches in real-time, and engage with a global community of athletes like never before.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-7 duration-1000">
                    <button 
                        onClick={() => navigate('/tournaments')}
                        className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2 active:scale-95"
                    >
                        <Trophy size={18} />
                        Browse Tournaments
                    </button>
                    
                    <button 
                        onClick={() => navigate('/live')}
                        className="h-12 px-8 rounded-full bg-background border border-input text-foreground font-semibold hover:bg-muted hover:text-primary transition-all flex items-center gap-2 group active:scale-95"
                    >
                        <PlayCircle size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        Watch Live Matches
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Hero;