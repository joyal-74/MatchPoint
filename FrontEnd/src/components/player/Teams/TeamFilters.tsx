import type { Team } from './Types';

export interface TeamFilters {
    sport?: string;
    state?: string;
    city?: string;
    phase?: "recruiting" | "active" | "completed";
    maxPlayers?: number;
}

interface TeamFiltersProps {
    filters: TeamFilters;
    onFilterChange: (filterName: keyof TeamFilters, value: string | number) => void;
    onClearFilters: () => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    showFilters: boolean;
    teams: Team[];
}

const TeamFilters: React.FC<TeamFiltersProps> = ({
    filters,
    onFilterChange,
    onClearFilters,
    sortBy,
    onSortChange,
    showFilters,
    teams
}) => {
    if (!showFilters) return null;

    // Collect unique values for each filter
    const sports = [...new Set(teams.map(t => t.sport))];
    const states = [...new Set(teams.map(t => t.state))];
    const cities = [...new Set(teams.map(t => t.city))];
    const phases = ["recruiting", "active", "completed"];
    const maxPlayersOptions = [...new Set(teams.map(t => t.maxPlayers))].sort((a, b) => a - b);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Sport */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Sport</label>
                    <select
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={filters.sport || ""}
                        onChange={e => onFilterChange('sport', e.target.value)}
                    >
                        <option value="">All Sports</option>
                        {sports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* State */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">State</label>
                    <select
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={filters.state || ""}
                        onChange={e => onFilterChange('state', e.target.value)}
                    >
                        <option value="">All States</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">City</label>
                    <select
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={filters.city || ""}
                        onChange={e => onFilterChange('city', e.target.value)}
                    >
                        <option value="">All Cities</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Phase */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Phase</label>
                    <select
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={filters.phase || ""}
                        onChange={e => onFilterChange('phase', e.target.value)}
                    >
                        <option value="">All Phases</option>
                        {phases.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                {/* Max Players */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Max Players</label>
                    <select
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={filters.maxPlayers || ""}
                        onChange={e => onFilterChange('maxPlayers', Number(e.target.value))}
                    >
                        <option value="">Any</option>
                        {maxPlayersOptions.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
                <button
                    onClick={onClearFilters}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-200"
                >
                    Clear all filters
                </button>

                <div className="flex items-center space-x-4">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Sort by:</span>
                    <select
                        className="p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={sortBy}
                        onChange={e => onSortChange(e.target.value)}
                    >
                        <option value="mostActive">Most Active</option>
                        <option value="recentlyCreated">Recently Created</option>
                        <option value="topPlayers">Top Players</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TeamFilters;