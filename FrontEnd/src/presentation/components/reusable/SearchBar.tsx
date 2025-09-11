import { Search } from 'lucide-react'

const SearchBar = () => {
    return (
        <div>
            <div className="flex justify-center items-center relative">
                <input
                    type="text"
                    placeholder="Search..."
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