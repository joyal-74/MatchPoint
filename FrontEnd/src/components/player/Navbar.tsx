import { Bell } from "lucide-react"

const Navbar: React.FC = () => {
    return (
        <div>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-20 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <h1 className="text-[var(--color-text-primary)] text-2xl font-rowdies">
                    <span className="text-[var(--color-primary)]">M</span>
                    atch
                    <span className="text-[var(--color-primary)]">P</span>
                    oint
                </h1>

                <div className="flex items-center gap-3 md:gap-4">
                    <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-full transition-all duration-200">
                        <Bell className="w-5 h-5" />
                    </button>

                    <img
                        src="https://i.pravatar.cc/40"
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-200 cursor-pointer"
                    />
                </div>

            </nav>
        </div>
    )
}

export default Navbar;