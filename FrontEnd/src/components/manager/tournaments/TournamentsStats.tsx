interface TournamentsStatsProps {
    totalTournaments: number;
    onLearnMore: () => void;
}

export default function TournamentsStats({ totalTournaments, onLearnMore }: TournamentsStatsProps) {
    return (
        <>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <StatCard
                    value={`${totalTournaments}+`}
                    label="Available Tournaments"
                    variant="primary" // Maps to your active theme (Green/Violet/etc.)
                />
                <StatCard
                    value="1,200+"
                    label="Teams Participating"
                    variant="blue"
                />
                <StatCard
                    value="15+"
                    label="Sports Categories"
                    variant="purple"
                />
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={onLearnMore}
                    className="group flex items-center gap-2 text-primary hover:text-primary/80 cursor-pointer font-medium text-sm md:text-base transition-colors"
                >
                    <span>💡 Learn how the prize pool is calculated and distributed</span>
                </button>
            </div>
        </>
    );
}

// Internal StatCard component with Semantic mapping
interface StatCardProps {
    value: string;
    label: string;
    variant: "primary" | "blue" | "purple";
}

function StatCard({ value, label, variant }: StatCardProps) {
    
    const variantStyles = {
        primary: "text-primary",
        blue: "text-blue-600 dark:text-blue-400",
        purple: "text-purple-600 dark:text-purple-400"
    };

    return (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className={`text-3xl font-bold ${variantStyles[variant]} mb-2`}>
                {value}
            </div>
            <div className="text-muted-foreground font-medium text-sm">
                {label}
            </div>
        </div>
    );
}