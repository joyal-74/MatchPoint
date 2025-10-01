import React from "react";

interface LoadingOverlayProps {
    show: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
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
};

export default LoadingOverlay;