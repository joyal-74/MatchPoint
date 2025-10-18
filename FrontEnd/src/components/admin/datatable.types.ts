import type { ReactNode } from "react";
import type { Player } from "../../types/Player";

interface Column<T> {
    id: string;
    label: string;
    accessor?: keyof T;
    render?: (row: T) => ReactNode;
    className?: string;
    player?: Player;
}

export interface DataTableProps<T> {
    title: string;
    data: T[];
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    columns: Column<T>[];
    filters?: string[];
    currentFilter?: string;
    onFilterChange: (filter: string) => void;
    onSearch: (search: string) => void;
    itemsPerPage?: number;
}