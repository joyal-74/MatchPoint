import type { ColorScheme } from "./teamColors";

export interface TeamInfoProps {
    name: string;
    sport: string;
    showSportBadge?: boolean;
    className?: string;
    colorScheme?: ColorScheme;
}

export default function TeamInfo({
    name,
    sport,
    showSportBadge = true,
    className = "",
    colorScheme
}: TeamInfoProps) {
    return (
        <div className={`min-w-0 ${className}`}>
            <h3 className={`text-md font-semibold truncate 
                ${colorScheme ? colorScheme.text : "text-white"}
            `}>
                {name}
            </h3>
            {showSportBadge && (
                <span className={`text-[12px] px-2 py-1 rounded inline-block mt-1
                    ${colorScheme
                        ? `${colorScheme.text} ${colorScheme.buttonBg} ${colorScheme.buttonHoverBg}`
                        : "text-neutral-400 bg-neutral-700/50"}
                `}>
                    {sport}
                </span>
            )}
        </div>
    );
}
