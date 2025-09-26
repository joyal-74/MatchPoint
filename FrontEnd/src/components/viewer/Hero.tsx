import { BsTrophy } from "react-icons/bs"
import { TbPlayerPlay } from "react-icons/tb"

const Hero = () => {
    return (
        <>
            <section className="relative bg-gradient-to-br from-[var(--color-background)] to-[var(--color-background-secondary)] bg-cover bg-center text-center py-26 px-6">
                <div className="max-w-4xl mx-auto">

                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] leading-snug flex flex-col">
                        Master Your{" "}
                        <span className="text-[var(--color-primary)]">
                            Tournament Arena
                        </span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        The ultimate platform for managing sports tournaments. Track live
                        matches, organize competitions, and engage with players like never
                        before.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <button className="flex items-center gap-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] px-6 py-3 rounded-lg shadow-[var(--shadow-md)] hover:bg-[var(--color-surface-secondary)] hover:scale-105 transition-all duration-300 border border-[var(--color-border)]">
                            <TbPlayerPlay className="text-xl text-[var(--color-primary)]" />
                            Watch Live Matches
                        </button>

                        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 py-3 rounded-lg shadow-[var(--shadow-md)] hover:bg-[var(--color-primary-hover)] hover:scale-105 transition-all duration-300">
                            <BsTrophy className="text-xl" />
                            Browse Tournaments
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
                        <div className="bg-[var(--color-surface)] rounded-lg py-6 px-4 shadow-[var(--shadow-md)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)] transition-all duration-300">
                            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                                50k+
                            </h2>
                            <p className="text-[var(--color-text-secondary)] mt-1">
                                Active Players
                            </p>
                        </div>
                        <div className="bg-[var(--color-surface)] rounded-lg py-6 px-4 shadow-[var(--shadow-md)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)] transition-all duration-300">
                            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                                1,200+
                            </h2>
                            <p className="text-[var(--color-text-secondary)] mt-1">
                                Tournaments
                            </p>
                        </div>
                        <div className="bg-[var(--color-surface)] rounded-lg py-6 px-4 shadow-[var(--shadow-md)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)] transition-all duration-300">
                            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                                24/7
                            </h2>
                            <p className="text-[var(--color-text-secondary)] mt-1">
                                Live Support
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero