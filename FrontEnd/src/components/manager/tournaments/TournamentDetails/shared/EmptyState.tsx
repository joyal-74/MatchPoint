interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message: string;
    subtitle: string;
    buttonText?: string;
    onAction?: () => void;
    titleSize?: string;
    messageSize?: string;
    subtitleSize?: string;
}

export default function EmptyState({
    icon,
    title,
    message,
    subtitle,
    buttonText,
    onAction,
    titleSize = "text-xl",
    messageSize = "text-md",
    subtitleSize = "text-sm text-neutral-400"
}: EmptyStateProps) {
    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6 text-center py-12">
            {icon}
            <h2 className={`${titleSize} font-semibold mb-2`}>{title}</h2>
            <p className={`${messageSize}`}>{message}</p>
            <p className={`${subtitleSize} mt-2`}>{subtitle}</p>
            {buttonText && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-colors mt-4"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
}
