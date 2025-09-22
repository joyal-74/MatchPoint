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
        <div className="p-6 text-[var(--color-text-primary)] mr-10">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            <div className="flex items-center justify-between mb-4">
                <SearchBar
                    value={localSearchTerm}
                    onChange={handleSearch}
                />
                <div className="flex gap-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f)}
                            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${currentFilter === f
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)] hover:text-white"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow border border-[var(--color-border)]">
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

            <Pagination
                totalItems={totalCount}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default DataTable;