import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    showClear?: boolean;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    searchQuery, 
    onSearchChange, 
    showClear = true, 
    onClear,
    placeholder = "Search teams, locations, sports...",
    className = ""
}) => {
    
    const handleClear = () => {
        if (onClear) {
            onClear();
        } else {
            onSearchChange('');
        }
    };

    return (
        <div className={`relative w-full ${className}`}>
            <div className="relative group">
                {/* Search Icon - Highlights on Focus */}
                <Search 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" 
                />
                
                {/* Input Field */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="
                        w-full pl-10 pr-10 py-2.5
                        bg-background text-foreground
                        border border-input rounded-xl
                        placeholder:text-muted-foreground
                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                        transition-all duration-200
                        shadow-sm
                    "
                />

                {/* Clear Button */}
                {showClear && searchQuery && (
                    <button
                        onClick={handleClear}
                        className="
                            absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                            text-muted-foreground hover:text-foreground hover:bg-muted
                            transition-all duration-200
                        "
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;