import { useState } from "react";
import type { DataTableProps } from "./datatable.types";
import SearchBar from "../../../../../components/reusable/SearchBar";
import Pagination from "../Pagination";

const DataTable = <T extends { id: string }>({
    title,
    data,
    columns,
    filters = ["All"],
    defaultFilter = "All",
    itemsPerPage = 10,
}: DataTableProps<T>) => {

    const [filter, setFilter] = useState(defaultFilter);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = filter === "All" ? data : data.filter((item) => (item as any).status === filter);

    return (
        <div className="p-6 text-[var(--color-text-primary)] mr-10">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>

            <div className="flex items-center justify-between mb-4">
                <SearchBar />
                <div className="flex gap-2">
                    {filters.map((f) => (
                        <button
                            key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white"
                                : "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)] hover:text-white"}`} >
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
                                <th key={col.key as string} className={`px-4 py-2 last:text-center ${col.className || ""}`}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--color-background-secondary)] py-1">
                        {filteredData.map((row) => (
                            <tr key={row.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-background-primary)] transition-colors" >
                                {columns.map((col) => (
                                    <td
                                        key={col.key as string} className="px-4 py-2 truncate" >
                                        {col.render ? col.render((row as any)[col.key], row) : (row as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                filteredData={filteredData}
                data={data}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

export default DataTable;