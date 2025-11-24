const LoadMoreButton = ({ loading, onClick }: { loading: boolean; onClick: () => void }) => {
    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={onClick}
                disabled={loading}
                className={`text-sm font-medium transition-colors px-2 py-1 rounded-md ${loading
                    ? "text-emerald-400/50 cursor-not-allowed"
                    : "text-emerald-400 hover:text-emerald-300"
                    }`}
            >
                {loading ? "Loading..." : "Load More"}
            </button>
        </div>
    );
}

export default LoadMoreButton;