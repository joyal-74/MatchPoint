import { ArrowRight } from "lucide-react";

const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "1.2K+", label: "Tournaments" },
    { value: "100+", label: "Countries" },
    { value: "98%", label: "Satisfaction" },
];

const TrustedSection = () => {
    return (
        <section className="bg-[var(--color-surface-secondary)] border border-[var(--color-border)] py-16 px-6 rounded-2xl max-w-7xl mx-auto my-12 shadow-[var(--shadow-lg)]">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                    Trusted by <span className="text-[var(--color-primary)]">Champions</span> Worldwide
                </h2>
                <p className="text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-10 text-lg">
                    Join the thousands of athletes and organizers who have made us their
                    tournament management platform of choice.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="group">
                            <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300">
                                {stat.value}
                            </p>
                            <p className="text-[var(--color-text-secondary)] mt-1 group-hover:text-[var(--color-text-primary)] transition-colors duration-300">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-8 py-4 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-xl)] group">
                    Start a free trial 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>
        </section>
    );
};

export default TrustedSection;