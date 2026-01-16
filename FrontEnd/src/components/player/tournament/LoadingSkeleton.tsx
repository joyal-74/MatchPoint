const LoadingSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 h-64 bg-muted rounded-2xl animate-pulse" />
                <div className="w-full md:w-2/3 space-y-4">
                    <div className="h-12 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-32 w-full bg-muted rounded animate-pulse mt-8" />
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;