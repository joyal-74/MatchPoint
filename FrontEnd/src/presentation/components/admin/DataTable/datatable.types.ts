import type { ReactNode } from "react";

interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => ReactNode;
    className?: string;
}

export interface DataTableProps<T> {
    title: string;
    data: T[];
    columns: Column<T>[];
    filters?: string[];
    defaultFilter?: string;
    itemsPerPage?: number;
}