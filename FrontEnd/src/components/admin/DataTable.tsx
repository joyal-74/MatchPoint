import { useState } from "react";
import type { DataTableProps } from "./datatable.types";
import SearchBar from "../shared/SearchBar";
import Pagination from "./Pagination";

const DataTable = <T extends { _id: string; status?: string }>({
    title,
    data,
    totalCount,
    currentPage,
    onPageChange,
    columns,
    filters = ["All"],
    currentFilter = "All",
    onFilterChange,
    onSearch,
    itemsPerPage = 10,
}: DataTableProps<T>) => {
    const [localSearchTerm, setLocalSearchTerm] = useState("");

    const handleSearch = (search: string) => {
        setLocalSearchTerm(search);
        onSearch(search);
    };

    return (
        <div className="p-3 sm:p-6 text-[var(--color-text-primary)] w-full max-w-full">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">{title}</h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                <div className="w-full sm:w-auto">
                    <SearchBar
                        placeholder={"Search for players"}
                        value={localSearchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f)}
                            className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm transition-colors flex-shrink-0 ${currentFilter === f
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)] hover:text-white"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Table View (xl screens and up) */}
            <div className="hidden xl:block overflow-x-auto rounded-lg shadow border border-[var(--color-border)]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[var(--color-primary-muted)]">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className={`px-4 py-2 last:text-center ${col.className || ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    
                    <tbody className="bg-[var(--color-background-secondary)] py-1">
                        {data.map((row) => (
                            <tr
                                key={row._id}
                                className="border-b border-[var(--color-border)] hover:bg-[var(--color-background-primary)] transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col.id} className="px-4 py-2 truncate">
                                        {col.render
                                            ? col.render(row)
                                            : col.accessor
                                                ? (row[col.accessor] as React.ReactNode)
                                                : null
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="xl:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((row) => (
                        <div
                            key={row._id}
                            className="bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-4 shadow hover:shadow-md transition-shadow"
                        >
                            <div className="space-y-3">
                                {columns.map((col) => {
                                    const value = col.render
                                        ? col.render(row)
                                        : col.accessor
                                            ? (row[col.accessor] as React.ReactNode)
                                            : null;

                                    // Skip empty values to save space
                                    if (!value && value !== 0) return null;

                                    return (
                                        <div key={col.id} className="flex flex-col space-y-1">
                                            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
                                                {col.label}
                                            </span>
                                            <div className="text-sm text-[var(--color-text-primary)] break-words">
                                                {value}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {data.length === 0 && (
                    <div className="text-center py-8 text-[var(--color-text-secondary)]">
                        <p>No data available</p>
                    </div>
                )}
            </div>

            {data.length === 0 && (
                <div className="hidden xl:block text-center py-8 text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-b-lg">
                    <p>No data available</p>
                </div>
            )}

            <div className="mt-5">
                <Pagination
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default DataTable;