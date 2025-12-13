import { useNavigate } from "react-router-dom";

const LiveMatchesTeaser = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-neutral-800 text-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold flex items-center justify-center mb-4">
                    <span className="mr-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    </span>
                    Live Matches Happening Now
                </h2>
                <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                    Dive into the action with real-time scores, highlights, and alerts from your favorite leagues. Stay updated and never miss a moment.
                </p>
            </div>

            {/* Footer Explanation */}
            <div className="text-center text-sm text-neutral-400 mb-8 max-w-md mx-auto">
                Customize your feed for personalized sports updates across NBA, Premier League, and more.
            </div>

            {/* Explore Button */}
            <div className="text-center">
                <button
                    onClick={() => navigate('/live')}
                    className="bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-4 px-10 rounded-full transition-colors duration-300 flex items-center justify-center mx-auto text-lg"
                >
                    Explore Live Matches
                    <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default LiveMatchesTeaser;