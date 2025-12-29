
const LoadingOverlay = ({ show }: { show: boolean }) => {
    return (
        <div 
            className={`
                fixed inset-0 z-[100] flex flex-col items-center justify-center 
                bg-background/80 backdrop-blur-sm 
                transition-opacity duration-300 ease-out
                ${show ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
            `}
        >
            {/* 1. The Stumps Container */}
            <div className="flex items-end gap-2 h-16">
                
                {/* Stump 1 */}
                <div 
                    className="w-3 bg-primary rounded-full transform-gpu"
                    style={{
                        height: '40px',
                        animation: 'wicketWave 1s ease-in-out infinite',
                        animationDelay: '0ms'
                    }}
                />
                

                <div 
                    className="w-3 bg-primary rounded-full transform-gpu"
                    style={{
                        height: '60px',
                        animation: 'wicketWave 1s ease-in-out infinite',
                        animationDelay: '150ms' 
                    }}
                />
                
                {/* Stump 3 */}
                <div 
                    className="w-3 bg-primary rounded-full transform-gpu"
                    style={{
                        height: '40px',
                        animation: 'wicketWave 1s ease-in-out infinite',
                        animationDelay: '300ms'
                    }}
                />
            </div>

            {/* 2. Text */}
            <div className="mt-6 flex flex-col items-center gap-1">
                <h3 className="text-xl font-bold font-rowdies tracking-wide text-foreground">
                    Match<span className="text-primary">Point</span>
                </h3>
                <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase animate-pulse">
                    Loading
                </p>
            </div>

            {/* 3. Custom Keyframes (Embedded for simplicity) */}
            <style>{`
                @keyframes wicketWave {
                    0%, 100% {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scaleY(0.6); /* Shrinks down smoothly */
                        opacity: 0.8;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoadingOverlay;