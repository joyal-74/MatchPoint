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
    itemsPerPage = 8,
}: DataTableProps<T>) => {
    const [localSearchTerm, setLocalSearchTerm] = useState("");

    const handleSearch = (search: string) => {
        setLocalSearchTerm(search);
        onSearch(search);
    };

    // Helper: Split columns for the mobile card view
    const primaryColumn = columns[0];
    const detailColumns = columns.slice(1);

    return (
        <div className="w-full space-y-4 sm:p-6 ">

            {/* Header & Controls */}
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>

                    {/* Filter Pills */}
                    {filters.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {filters.map((f) => {
                                const isActive = currentFilter === f;
                                return (
                                    <button
                                        key={f}
                                        onClick={() => onFilterChange(f)}
                                        className={`
                                            px-3 py-1 text-sm font-medium rounded-full transition-all border
                                            ${isActive
                                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                                            }
                                        `}
                                    >
                                        {f.split('_').join(' ')}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="w-full sm:max-w-xs">
                    <SearchBar
                        placeholder="Search..."
                        value={localSearchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40 border-b border-border">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.id}
                                        // UPDATED: Allow passing text-center/right and widths
                                        className={`px-3 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider whitespace-nowrap ${col.className || ""}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {data.map((row) => (
                                <tr key={row._id} className="hover:bg-muted/50 transition-colors">
                                    {columns.map((col) => (
                                        <td
                                            key={col.id}
                                            // UPDATED: Inherit text alignment from col.className logic
                                            className={`px-3 py-3 text-foreground whitespace-nowrap ${col.className?.includes('text-right') ? 'text-right' : col.className?.includes('text-center') ? 'text-center' : 'text-left'}`}
                                        >
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
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {data.map((row) => {
                    const primaryValue = primaryColumn.render
                        ? primaryColumn.render(row)
                        : (row[primaryColumn.accessor as keyof T] as React.ReactNode);

                    return (
                        <div
                            key={row._id}
                            className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden"
                        >
                            {/* Card Header: Themed background with accent border */}
                            <div className="relative px-5 py-3 border-b border-border bg-primary/10 flex justify-between items-center">
                                {/* Theme Accent Line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

                                <div className="font-bold text-foreground text-base truncate pl-2">
                                    {primaryValue}
                                </div>

                                {row.status && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-background text-primary border border-primary/20">
                                        {row.status}
                                    </span>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-2">
                                {detailColumns.map((col) => {
                                    const value = col.render
                                        ? col.render(row)
                                        : col.accessor
                                            ? (row[col.accessor] as keyof T)
                                            : null;

                                    if (!value && value !== 0) return null;

                                    return (
                                        <div key={col.id} className="flex flex-col col-span-1 overflow-hidden">
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                {col.label}
                                            </span>
                                            <span className="text-sm font-medium text-foreground truncate">
                                                {value as React.ReactNode}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border rounded-xl bg-muted/20">
                    <p className="text-sm font-medium text-foreground">No results found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                </div>
            )}

            {/* Pagination */}
            {totalCount > 0 && data.length > 0 && (
                <Pagination
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
};

export default DataTable;