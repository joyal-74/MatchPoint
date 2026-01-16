import React from "react";
import '../../../assets/styles/CoinFlip.css';

export const COIN_FLIP_TIME_MS = 2500;

interface CoinFlipProps {
    isFlipping: boolean;
}

export const CoinFlip: React.FC<CoinFlipProps> = React.memo(({ isFlipping }) => {
    return (
        <div className="flex justify-center items-center h-full min-h-[80px]">

            <div className={`relative w-20 h-20 transform-style-3d ${isFlipping ? 'animate-flip' : ''}`}>
                
                <div
                    className="
                        absolute inset-0 w-full h-full rounded-full 
                        bg-gradient-to-br from-primary to-primary/80 
                        border-4 border-primary/30 
                        shadow-lg shadow-primary/20
                        flex items-center justify-center 
                        backface-hidden z-10
                    "
                >
                    <span className="text-xs font-black tracking-widest text-primary-foreground drop-shadow-sm">
                        HEADS
                    </span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50 pointer-events-none" />
                </div>

                {/* Tails face - Uses SECONDARY Theme Color */}
                <div
                    className="
                        absolute inset-0 w-full h-full rounded-full 
                        bg-gradient-to-br from-secondary to-secondary/80 
                        border-4 border-border 
                        shadow-lg
                        flex items-center justify-center 
                        backface-hidden rotate-y-180
                    "
                >
                    <span className="text-xs font-black tracking-widest text-secondary-foreground">
                        TAILS
                    </span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 pointer-events-none" />
                </div>
            </div>
        </div>
    );
});