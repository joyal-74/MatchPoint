import ThemeSwitcher from "../../components/common/ThemeSwitcher"
import { Bell, Search } from "lucide-react"

const Navbar = () => {
    return (
        <div>
            <nav className="flex items-center justify-between px-6 md:px-20 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <h1 className="text-[var(--color-text-primary)] text-2xl font-rowdies">
                    <span className="text-[var(--color-primary)]">M</span>
                    atch
                    <span className="text-[var(--color-primary)]">P</span>
                    oint
                </h1>

                <ul className="hidden md:flex gap-8 lg:gap-12 ml-12 text-[var(--color-text-primary)] font-medium">
                    <li>
                        <a
                            href="#"
                            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-200 font-semibold"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#" 
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            Tournaments
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#" 
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            Live
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#" 
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            Leaderboard
                        </a>
                    </li>
                </ul>

                <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] rounded-full pl-4 pr-10 py-2 border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200"
                        />
                        <Search className="absolute right-3 top-2.5 w-5 h-5 text-[var(--color-text-tertiary)]" />
                    </div>

                    <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-full transition-all duration-200">
                        <Bell className="w-5 h-5" />
                    </button>
                
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
                    />
                    
                    <ThemeSwitcher/>
                </div>
            </nav>
        </div>
    )
}

export default Navbar