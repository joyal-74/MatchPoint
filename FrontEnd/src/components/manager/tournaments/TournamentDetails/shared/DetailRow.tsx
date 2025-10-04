interface DetailRowProps {
    label: string;
    value: string | number;
    highlight?: string;
    icon?: React.ReactNode;
}

export default function DetailRow({ label, value, highlight, icon }: DetailRowProps) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-neutral-700/30">
            <span className="text-neutral-400 flex items-center gap-2">
                {icon}
                {label}
            </span>
            <span className={`font-medium ${highlight || ""}`}>{value}</span>
        </div>
    );
}