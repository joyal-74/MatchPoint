const SkeletonCard = () => {
    return (
        <div className="bg-[var(--color-surface)] animate-pulse rounded-lg px-6 py-6 shadow-[var(--shadow-md)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-4">
                <div className="w-14 h-5 rounded-full bg-[var(--color-surface-secondary)]" />
                <div className="w-16 h-5 rounded-full bg-[var(--color-surface-secondary)]" />
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="w-20 h-6 bg-[var(--color-surface-secondary)] rounded" />
                <div className="mx-4">
                    <div className="w-16 h-6 bg-[var(--color-surface-secondary)] rounded mb-2" />
                    <div className="w-20 h-4 bg-[var(--color-surface-secondary)] rounded" />
                </div>
                <div className="w-20 h-6 bg-[var(--color-surface-secondary)] rounded" />
            </div>

            <div className="mb-4 space-y-3">
                <div className="w-full h-4 bg-[var(--color-surface-secondary)] rounded" />
                <div className="w-full h-4 bg-[var(--color-surface-secondary)] rounded" />
            </div>

            <div className="w-full h-10 rounded bg-[var(--color-surface-secondary)]" />
        </div>
    );
};

export default SkeletonCard;