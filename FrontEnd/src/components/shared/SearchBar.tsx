import { Search } from 'lucide-react'

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
    return (
        <div>
            <div className="flex justify-center items-center relative">
                <input
                    type="text"
                    placeholder={placeholder || "Search..."}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-9 py-2 w-100 rounded-lg text-sm bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] placeholder-gray-400 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
                <div className="absolute left-3">
                    <Search size={16} />
                </div>
            </div>
        </div>
    )
}

export default SearchBar