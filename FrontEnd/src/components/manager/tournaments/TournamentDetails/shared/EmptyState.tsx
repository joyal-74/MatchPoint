interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
    subtitle: string;
}

export default function EmptyState({ icon, title, message, subtitle }: EmptyStateProps) {
    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6 text-center py-12">
            {icon}
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-lg">{message}</p>
            <p className="text-sm text-neutral-400 mt-2">{subtitle}</p>
        </div>
    );
}