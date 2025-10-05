import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${currentPage === page
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;