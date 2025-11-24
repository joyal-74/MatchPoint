import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    showClear?: boolean;
    onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange, showClear = true, onClear }) => {
    return (
        <div className="relative min-w-3xl">
            <div className="flex gap-2">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search teams, locations, sports..."
                        className="w-full pl-10 pr-10 py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 transition-colors duration-200"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {showClear && searchQuery && (
                        <button
                            onClick={onClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SearchBar;