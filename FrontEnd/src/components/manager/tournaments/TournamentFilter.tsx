export type FilterStatus = "all" | "upcoming" | "ongoing" | "completed";

interface TournamentFilterProps {
    activeFilter: FilterStatus;
    setActiveFilter: (filter: FilterStatus) => void;
    resultsCount?: number;
}

export default function TournamentFilter({ activeFilter, setActiveFilter }: TournamentFilterProps) {
    const filterOptions = [
        { key: "all" as const, label: "All" },
        { key: "upcoming" as const, label: "Upcoming" },
        { key: "ongoing" as const, label: "Active" },
        { key: "completed" as const, label: "Completed" }
    ];

    return (
        <div className="flex items-center gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {filterOptions.map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 border whitespace-nowrap
                            ${activeFilter === filter.key
                                ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                                : "bg-card/50 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground hover:border-muted-foreground/30"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}