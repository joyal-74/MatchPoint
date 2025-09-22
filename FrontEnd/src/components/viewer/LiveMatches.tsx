import { FaMapMarkerAlt, FaEye, FaClock } from "react-icons/fa";

const matches = [
    {
        id: 1,
        team1: "KBFC",
        team2: "NEUFC",
        score: "3-1",
        status: "67",
        type: "Football",
        location: "Jawaharlal Nehru Stadium, Kochi",
        watching: "2.5k",
        live: true,
    },
    {
        id: 2,
        team1: "Adholokam",
        team2: "Blue Tigers",
        score: "187-7",
        status: "2nd Innings",
        type: "Cricket",
        location: "Jawaharlal Nehru Stadium, Kochi",
        watching: "22.8k",
        live: true,
    },
    {
        id: 3,
        team1: "KBFC",
        team2: "NEUFC",
        score: "3-1",
        status: "67",
        type: "Football",
        location: "Jawaharlal Nehru Stadium, Kochi",
        watching: "2.5k",
        live: true,
    },
];

const LiveMatches = () => {
    return (
        <section className="text-center max-w-7xl mx-auto py-10 px-6">
            <h2 className="text-[var(--color-primary)] text-4xl font-bold">
                Live Matches
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mt-5 mb-8 max-w-2xl mx-auto">
                Watch exciting matches happening right now. Join thousands of fans 
                experiencing the thrill of live sports tournaments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-center">
                {matches.map((match) => (
                    <div
                        key={match.id}
                        className="bg-[var(--color-surface)] flex flex-col gap-3 rounded-lg px-6 py-6 text-left shadow-[var(--shadow-md)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)]"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="flex items-center text-xs text-white bg-[var(--color-error)] px-2 py-1 rounded-full font-medium">
                                🔴 Live
                            </span>
                            <span className="border border-[var(--color-border)] px-2 py-1 text-xs rounded-full text-[var(--color-text-tertiary)] bg-[var(--color-surface-secondary)]">
                                {match.type}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-[var(--color-text-primary)] flex-1 text-center">
                                {match.team1}
                            </h3>
                            <div className="text-center mx-4">
                                <p className="text-2xl font-bold text-[var(--color-primary)]">
                                    {match.score}
                                </p>
                                <span className="flex items-center text-sm text-[var(--color-text-tertiary)] justify-center mt-1">
                                    <FaClock className="mr-1" /> {match.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-[var(--color-text-primary)] flex-1 text-center">
                                {match.team2}
                            </h3>
                        </div>

                        <div className="mb-4 space-y-2">
                            <p className="flex items-center text-sm text-[var(--color-text-secondary)]">
                                <FaMapMarkerAlt className="mr-2 text-[var(--color-primary)]" /> 
                                {match.location}
                            </p>
                            <p className="flex items-center text-sm text-[var(--color-text-secondary)]">
                                <FaEye className="mr-2 text-[var(--color-primary)]" /> 
                                {match.watching} Watching
                            </p>
                        </div>

                        <button className="w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] font-semibold py-2 rounded-md hover:bg-[var(--color-primary-hover)] hover:scale-105 transition-all duration-300 shadow-[var(--shadow-sm)]">
                            Watch Live
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <button className="border border-[var(--color-border)] px-6 py-3 rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 shadow-[var(--shadow-sm)]">
                    View More Matches
                </button>
            </div>
        </section>
    );
};

export default LiveMatches;