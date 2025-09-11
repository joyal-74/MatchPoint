import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<T> {
    filteredData: T[];
    data: T[];
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const Pagination = <T extends { id: string }>({
    filteredData,
    data,
    itemsPerPage,
    currentPage,
    setCurrentPage,
}: PaginationProps<T>) => {

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-[var(--color-text-primary)]">
                Showing {filteredData.length} of {data.length}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 flex items-center py-1.5 text-sm bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-l-md disabled:opacity-50"
                >
                    <ChevronLeft size={16} /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm border border-[var(--color-border)] ${page === currentPage
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-background-secondary)] text-gray-300"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}

                    disabled={currentPage === totalPages}
                    className="px-4 flex items-center py-1.5 text-sm bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-r-md disabled:opacity-50"
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;