import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Trophy, Calendar, Filter } from "lucide-react";
import PlayerCard from "./PlayerCard";
import type { PlayerRole } from "./leaderboardData";
import type { TimePeriod } from "../../../features/shared/leaderboard/leaderboardTypes";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import type { RootState } from "../../../app/rootReducer";
import { fetchLeaderboardData } from "../../../features/shared/leaderboard/leaderboardThunks";
import { useDebounce } from "../../../hooks/useDebounce";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import Navbar from "../../../components/viewer/Navbar";
import RoleLayoutWrapper from "../RoleLayoutWrapper";

const roleOptions: PlayerRole[] = ["Batter", "Bowler", "Allrounder"];
const timePeriodOptions: TimePeriod[] = ["All Time", "2024", "2023", "2022", "2021", "2020"];

const headers = ["Rank", "Name", "Match", "Role", "Runs", "100", "50", "Bat. average", "Strike rate", "Best"] as const;

const tableKeyMap: Record<string, string> = {
    Rank: "rank",
    Name: "name",
    Match: "matches",
    Role: "role",
    Runs: "runs",
    "100": "hundreds",
    "50": "fifties",
    "Bat. average": "average",
    "Strike rate": "strikeRate",
    Best: "best",
};

const AllTimeLeaderboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { topPlayers, leaderboard, loading } = useAppSelector((state: RootState) => state.leaderboard);

    const [selectedRole, setSelectedRole] = useState<PlayerRole>("Batter");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("All Time");
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>("");

    const debouncedSearch = useDebounce(search, 1000);

    useEffect(() => {
        const filters = {
            position: selectedRole,
            search: debouncedSearch,
            page: String(page),
            limit: "10",
            timePeriod: selectedTimePeriod,
        };
        dispatch(fetchLeaderboardData(filters));
    }, [dispatch, selectedRole, selectedTimePeriod, page, debouncedSearch]);

    return (
        <>
            <div className="min-h-screen bg-background text-foreground pb-20">
                <LoadingOverlay show={loading} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                    {/* --- Header Section --- */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                <Trophy className="text-primary h-8 w-8" />
                                Global Leaderboard
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Tracking the top performers across all seasons.
                            </p>
                        </div>

                        {/* Time Period Filter */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <Calendar size={16} />
                            </div>
                            <select
                                value={selectedTimePeriod}
                                onChange={(e) => setSelectedTimePeriod(e.target.value as TimePeriod)}
                                className="appearance-none pl-10 pr-10 py-2.5 bg-card border border-border text-foreground rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/50 transition-colors shadow-sm cursor-pointer"
                            >
                                {timePeriodOptions.map((period) => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <Filter size={14} />
                            </div>
                        </div>
                    </header>

                    {/* --- Top Players Podium --- */}
                    {topPlayers && topPlayers.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full" />
                                Top Performers
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {topPlayers.map((player, idx) => (
                                    <PlayerCard key={idx} player={player} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- Controls Bar --- */}
                    <section className="bg-card border border-border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Role Pills */}
                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border w-full md:w-auto overflow-x-auto">
                            {roleOptions.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`
                                    px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 md:flex-none
                                    ${selectedRole === role
                                            ? "bg-background text-primary shadow-sm ring-1 ring-border"
                                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                        }
                                `}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search player name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </section>

                    {/* --- Data Table --- */}
                    <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead>
                                    <tr className="bg-muted/50">
                                        {headers.map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border bg-card">
                                    {!loading && leaderboard && leaderboard.map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-muted/30 transition-colors duration-150 group"
                                        >
                                            {headers.map((header) => {
                                                const key = tableKeyMap[header];
                                                let value;

                                                if (header === "Rank") {
                                                    value = (page - 1) * 10 + idx + 1;
                                                    return (
                                                        <td key={header} className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`
                                                            inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                                                            ${value === 1 ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
                                                                    value === 2 ? 'bg-gray-400/10 text-gray-500 border border-gray-400/20' :
                                                                        value === 3 ? 'bg-orange-700/10 text-orange-700 border border-orange-700/20' :
                                                                            'text-muted-foreground bg-muted/50'}
                                                        `}>
                                                                {value}
                                                            </span>
                                                        </td>
                                                    );
                                                } else {
                                                    value = row[key];
                                                }

                                                return (
                                                    <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                                                        {value}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}

                                    {!loading && (!leaderboard || leaderboard.length === 0) && (
                                        <tr>
                                            <td colSpan={headers.length} className="text-center py-16 text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="h-8 w-8 opacity-20" />
                                                    <p>No players found matching your criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- Pagination --- */}
                        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/20">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>

                            <span className="text-sm font-medium text-foreground">
                                Page {page}
                            </span>

                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!leaderboard || leaderboard.length < 10} // Assuming limit is 10
                                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground transition-all shadow-sm"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AllTimeLeaderboard;