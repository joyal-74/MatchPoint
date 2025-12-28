import { Search } from 'lucide-react'

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    value, 
    onChange, 
    placeholder = "Search...",
    className = ""
}) => {
    return (
        <div className={`relative w-full ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-muted-foreground" />
            </div>

            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    block w-full pl-10 pr-4 py-2.5
                    text-sm text-foreground
                    bg-card border border-border
                    rounded-lg
                    placeholder:text-muted-foreground
                    focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                    transition-all duration-200 ease-in-out
                    shadow-sm
                `}
            />
        </div>
    )
}

export default SearchBar;