import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, FileQuestion, SearchX } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
            
            {/* Ambient Background Glow - Uses Primary Color */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">

                {/* Visual 404 Construction */}
                <div className="relative h-40 flex items-center justify-center">
                    {/* Large Background Text */}
                    <div className="absolute text-9xl font-black text-foreground/5 select-none tracking-widest blur-[2px]">
                        404
                    </div>
                    
                    {/* Floating Card Icon */}
                    <div className="relative z-10 w-28 h-28 bg-card border border-border rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/10 rotate-12 hover:rotate-0 transition-transform duration-500 ease-out">
                        <FileQuestion className="w-14 h-14 text-primary" strokeWidth={1.5} />
                    </div>
                    
                    {/* Secondary Floating Icon (Decoration) */}
                    <div className="absolute z-0 right-20 top-0 w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center -rotate-12 animate-pulse">
                        <SearchX className="w-6 h-6 text-muted-foreground" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL is incorrect.
                    </p>
                </div>

                {/* Error Details Chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Error_Code: 404_NOT_FOUND
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all shadow-lg shadow-primary/20 active:scale-95 group"
                    >
                        <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        Back to Homepage
                    </Link>

                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground font-medium transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NotFoundPage;