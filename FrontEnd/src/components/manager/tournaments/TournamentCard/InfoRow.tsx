interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    completed?: boolean;
}

export function InfoRow({ icon, label, completed }: InfoRowProps) {
    return (
        <div className="flex items-center gap-2 text-sm text-neutral-200">
            <div
                className={`
          w-6 h-6 rounded-full flex items-center justify-center
          ${completed ? "bg-white/5" : "bg-white/10"}
        `}
            >
                {icon}
            </div>
            <span className="line-clamp-1">{label}</span>
        </div>
    );
}
