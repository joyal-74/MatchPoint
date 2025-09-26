import { Search } from 'lucide-react'

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <div>
            <div className="flex justify-center items-center relative">
                <input
                    type="text"
                    placeholder="Search..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="px-4 py-1.5 w-80 rounded-lg text-sm bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] placeholder-gray-400 border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
                <div className="absolute right-2">
                    <Search size={16} />
                </div>
            </div>
        </div>
    )
}

export default SearchBar