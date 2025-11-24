import { Trophy } from "lucide-react";

interface PrizePoolBadgeProps {
    amount: string;
    colorScheme: {
        text?: string;
        buttonBg?: string;
        buttonHoverBg?: string;
        bg?: string;
    };
}

export default function PrizePoolBadge({ amount, colorScheme }: PrizePoolBadgeProps) {
    return (
        <div className="absolute top-14 right-4 flex flex-col items-center">            
            <div className={`
                relative w-16 h-16
                bg-gradient-to-br ${colorScheme.buttonBg}
                rounded-full flex flex-col items-center justify-center
                shadow-lg border border-white/20
                hover:scale-110 transition-transform duration-300
                group
            `}>
                <Trophy size={18} className={colorScheme.text || "text-white"} />
                <div className={`text-[10px] font-black ${colorScheme.text || "text-white"} leading-none mt-0.5`}>
                    {amount}
                </div>
            </div>
        </div>
    );
}