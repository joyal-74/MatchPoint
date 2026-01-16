import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Don't render pagination if there is only 1 page
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center pt-4">
            <nav className="flex items-center gap-2" role="navigation" aria-label="Pagination">
                
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="
                        p-2 rounded-lg border border-border bg-background text-foreground
                        hover:bg-muted hover:text-foreground transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background
                        focus:outline-none focus:ring-2 focus:ring-primary/20
                    "
                    aria-label="Previous Page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`
                                w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-primary/20
                                ${currentPage === page
                                    ? 'bg-primary text-primary-foreground shadow-sm transform scale-105'
                                    : 'bg-background border border-border text-foreground hover:bg-muted hover:border-muted-foreground/30'
                                }
                            `}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="
                        p-2 rounded-lg border border-border bg-background text-foreground
                        hover:bg-muted hover:text-foreground transition-colors duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background
                        focus:outline-none focus:ring-2 focus:ring-primary/20
                    "
                    aria-label="Next Page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;