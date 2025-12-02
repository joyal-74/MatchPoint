import React, { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import type { PlayerRole } from "./leaderboardData";
import type { TimePeriod } from "../../../features/shared/leaderboard/leaderboardTypes";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import type { RootState } from "../../../app/rootReducer";
import { fetchLeaderboardData } from "../../../features/shared/leaderboard/leaderboardThunks";
import { useDebounce } from "../../../hooks/useDebounce";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";


const roleOptions: PlayerRole[] = ["Batter", "Bowler", "Allrounder"];
const timePeriodOptions: TimePeriod[] = [
    "All Time", "2024", "2023", "2022", "2021", "2020",
];

const headers = ["Rank", "Name", "Match", "Role", "Runs", "100", "50", "Bat. average", "Strike rate", "Best",] as const;
const tableKeyMap = {
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

    const { topPlayers, leaderboard, loading } = useAppSelector(
        (state: RootState) => state.leaderboard
    );

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
            <LoadingOverlay show={loading} />

            <div className="bg-neutral-900 mx-12 md:px-8 py-4 pt-16">
                <header className="flex justify-between items-center mb-5 pt-4">
                    <h1 className="text-2xl font-bold text-white">All Time Leaderboard</h1>

                    <div className="relative">
                        <select
                            value={selectedTimePeriod}
                            onChange={(e) => setSelectedTimePeriod(e.target.value as TimePeriod)}
                            className="bg-neutral-800 text-white px-6 py-2 rounded-lg text-sm font-semibold border border-neutral-700"
                        >
                            {timePeriodOptions.map((period) => (
                                <option key={period} value={period}>
                                    {period}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>

                {/* Top Players */}
                <section className="grid grid-cols-4 justify-center gap-6 mb-8">
                    {!loading && topPlayers && topPlayers.map((player, idx) => (
                        <PlayerCard key={idx} player={player} />
                    ))}
                </section>

                <section className="mb-6 flex justify-between items-center flex-wrap">
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                        {roleOptions.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm ${selectedRole === role
                                    ? "bg-green-600 text-white"
                                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <div className="ml-4">
                        <input
                            type="text"
                            placeholder="Search player..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-neutral-800 text-white px-4 min-w-md py-2 rounded-lg text-sm border border-neutral-700 focus:ring-green-600 focus:border-green-600"
                        />
                    </div>
                </section>

                {/* Leaderboard Table */}
                <section className="overflow-x-auto shadow-2xl rounded-lg">
                    <table className="min-w-full divide-y divide-neutral-700">
                        <thead>
                            <tr className="bg-green-600">
                                {headers.map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="bg-neutral-800 divide-y divide-neutral-700">
                            {!loading && leaderboard && leaderboard.map((row, idx) => (
                                <tr key={idx} className="hover:bg-neutral-700 transition">

                                    {headers.map((header) => {
                                        const key = tableKeyMap[header];
                                        let value;

                                        if (header === "Rank") {
                                            value = (page - 1) * 10 + idx + 1;
                                        } else {
                                            value = row[key];
                                        }

                                        return (
                                            <td key={header} className="px-6 py-4 text-sm text-neutral-300">
                                                {value}
                                            </td>
                                        );
                                    })}

                                </tr>
                            ))}

                            {!loading && !leaderboard?.length && (
                                <tr>
                                    <td colSpan={headers.length} className="text-center text-neutral-400 py-6">
                                        No players found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </section>

                {/* Pagination */}
                <div className="flex justify-end items-center mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm mr-2"
                    >
                        Prev
                    </button>

                    <span className="text-neutral-400 mr-4">Page {page}</span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-sm ml-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default AllTimeLeaderboard;