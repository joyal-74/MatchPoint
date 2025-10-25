import React from "react";

interface LoadingOverlayProps {
    show: boolean;
    theme?: 'simple' | 'gradient'; // Keep for other pages
    tintOnly?: boolean; // New: true = no full overlay, just a center tint + spinner
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, theme = 'gradient', tintOnly = false }) => {
    if (theme === 'simple') {
        // Original for other pages
        return (
            <div 
                className={`fixed inset-0 z-100 flex items-center justify-center bg-[var(--color-background-overlay)]/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                    show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div className="relative">
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-white/30 border-r-white/30 rounded-full animate-spin" 
                         style={{ animationDuration: '1.5s' }}></div>
                    
                    <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-b-white/50 border-l-white/50 rounded-full animate-spin" 
                         style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center animate-spin" 
                         style={{ animationDuration: '0.8s' }}>
                        <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/20 rounded-full animate-ping" 
                             style={{ animationDuration: '1.5s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Gradient theme: Ultra-light for this page
    return (
        <div 
            className={`fixed inset-0 z-100 flex items-center justify-center transition-all duration-300 ease-in-out ${
                show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            {!tintOnly && (
                // Super-light gradient: /20 opacity to let background dominate
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/20 via-neutral-950/15 to-black/20"></div>
            )}
            
            {/* Minimal radial echo: Just a soft center glow, no heavy blur */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,neutral-900/10_50%,transparent_100%)]"></div>
            
            {/* Skip blobs if tintOnly; otherwise, faint echoes */}
            {!tintOnly && (
                <>
                    <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-500/3 to-cyan-600/3 rounded-full blur-2xl -translate-x-1/4 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/3 to-purple-600/3 rounded-full blur-2xl translate-x-1/4 translate-y-1/4"></div>
                </>
            )}

            <div className="relative z-10">
                {/* Outer: Even subtler */}
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-white/10 border-r-[var(--color-primary)]/30 rounded-full animate-spin" 
                     style={{ animationDuration: '1.5s' }}></div>
                
                {/* Inner: Minimal */}
                <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-b-white/20 border-l-white/20 rounded-full animate-spin" 
                     style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}></div>
                
                {/* Center: Keep bold for UX */}
                <div className="absolute inset-0 flex items-center justify-center animate-spin" 
                     style={{ animationDuration: '0.8s' }}>
                    <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full shadow-md"></div>
                </div>
                
                {/* Pulse: Barely there */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-[var(--color-primary)]/5 rounded-full animate-ping" 
                         style={{ animationDuration: '2s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;