import React from "react";
import '../../../assets/styles/CoinFlip.css'

export const COIN_FLIP_TIME_MS = 2500;

interface CoinFlipProps {
    isFlipping: boolean;
}

export const CoinFlip: React.FC<CoinFlipProps> = React.memo(({ isFlipping }) => {
    return (
        <div className="flex justify-center items-center h-full">
            <div className={`relative w-16 h-16 rounded-full perspective ${isFlipping ? 'animate-flip' : ''}`}>
                {/* Heads face */}
                <div
                    className={`absolute inset-0 w-full h-full rounded-full bg-amber-400 flex items-center justify-center text-lg font-bold text-neutral-900 backface-hidden ${isFlipping ? '' : 'rotate-y-0'}`}
                > Heads
                </div>

                <div
                    className={`absolute inset-0 w-full h-full rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold text-white backface-hidden rotate-y-180 ${isFlipping ? '' : 'rotate-y-180'}`}
                >Tails
                </div>
            </div>
        </div>
    );
});
