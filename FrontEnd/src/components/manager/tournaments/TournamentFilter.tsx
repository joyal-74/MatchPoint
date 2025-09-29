export type FilterStatus = "all" | "ongoing" | "completed";

interface TournamentFilterProps {
    activeFilter: FilterStatus;
    setActiveFilter: (filter: FilterStatus) => void;
    resultsCount?: number;
}

export default function TournamentFilter({
    activeFilter,
    setActiveFilter,
}: TournamentFilterProps) {
    const filterOptions = [
        { key: "all" as const, label: "All" },
        { key: "ongoing" as const, label: "Active" },
        { key: "completed" as const, label: "Completed" }
    ];

    return (

        <div className="flex items-center gap-3">
            <div className="flex gap-2">
                {filterOptions.map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${activeFilter === filter.key
                            ? "bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg"
                            : "bg-neutral-700/30 text-neutral-400 border border-neutral-600/30 hover:bg-neutral-700/50 hover:text-neutral-300"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>

    );
}