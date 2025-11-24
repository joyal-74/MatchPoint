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
                    color="green"
                />
                <StatCard
                    value="1,200+"
                    label="Teams Participating"
                    color="blue"
                />
                <StatCard
                    value="15+"
                    label="Sports Categories"
                    color="purple"
                />
            </div>

            <div className="flex justify-center mt-5">
                <button
                    onClick={onLearnMore}
                    className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold text-sm md:text-base transition-colors decoration-blue-400 hover:decoration-blue-300"
                >
                    💡 Learn how the prize pool is calculated and distributed
                </button>
            </div>
        </>
    );
}

function StatCard({ value, label, color }: { value: string; label: string; color: "green" | "blue" | "purple" }) {
    const colorClasses = {
        green: "text-green-400",
        blue: "text-blue-400",
        purple: "text-purple-400"
    };

    return (
        <div className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-700/30 backdrop-blur-sm">
            <div className={`text-2xl font-bold ${colorClasses[color]} mb-2`}>{value}</div>
            <div className="text-neutral-400">{label}</div>
        </div>
    );
}