interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

export const InfoItem = ({ icon, label, value }: InfoRowProps) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase text-neutral-500 font-medium flex items-center gap-1.5">
            {icon} {label}
        </span>
        <span className="text-sm font-medium text-neutral-200 truncate">{value}</span>
    </div>
);