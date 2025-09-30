export interface TeamInfoProps {
    name: string;
    sport: string;
    showSportBadge?: boolean;
    className?: string;
}

export default function TeamInfo({ name, sport, showSportBadge = true, className = "" }: TeamInfoProps) {
    return (
        <div className={`min-w-0 ${className}`}>
            <h3 className="text-md font-semibold text-white truncate">{name}</h3>
            {showSportBadge && (
                <span className="text-sm text-neutral-400 bg-neutral-700/50 px-2 py-1 rounded inline-block mt-1">
                    {sport}
                </span>
            )}
        </div>
    );
}