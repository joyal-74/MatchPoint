import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

const Pagination = ({ 
    totalItems, 
    itemsPerPage, 
    currentPage, 
    onPageChange,
    siblingCount = 1 
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    // Logic to generate page numbers with ellipses
    const generatePagination = () => {
        // If total pages is small, show everything
        if (totalPages <= 5 + siblingCount * 2) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, "...", totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, "...", ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
        }

        return [];
    };

    const pages = generatePagination();

    return (
        <div className="flex items-center justify-center gap-2 select-none">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="
                    p-2 rounded-lg border border-border bg-card text-muted-foreground 
                    hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                "
                aria-label="Previous Page"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <div key={`dots-${index}`} className="px-2 text-muted-foreground">
                                <MoreHorizontal size={16} />
                            </div>
                        );
                    }

                    const isCurrent = page === currentPage;
                    
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`
                                min-w-[32px] h-8 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
                                ${isCurrent
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-card text-foreground border-transparent hover:bg-muted hover:border-border"
                                }
                            `}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="
                    p-2 rounded-lg border border-border bg-card text-muted-foreground 
                    hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                "
                aria-label="Next Page"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;