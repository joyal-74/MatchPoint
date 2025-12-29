import { getFieldIcon } from "../../../utils/getFieldIcon";

interface InfoItem {
    label: string;
    value: string | number | null;
    // We keep 'color' in the interface to not break your existing data, 
    // but we will prioritize the Theme System for styling.
    color?: string; 
}

interface InfoGridProps {
    data: InfoItem[];
}

const InfoGrid = ({ data }: InfoGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="
                        group flex items-start gap-4 p-4 rounded-xl border border-border bg-card shadow-sm
                        transition-all duration-200 
                        hover:shadow-md hover:border-primary/30
                    "
                >
                    {/* Icon Container: Uses Theme Primary Color */}
                    <div className="
                        shrink-0 flex items-center justify-center w-10 h-10 rounded-lg 
                        bg-primary/10 text-primary 
                        group-hover:bg-primary group-hover:text-primary-foreground
                        transition-colors duration-200
                    ">
                        {/* We clone the icon to enforce size consistency if needed */}
                        <span className="text-xl">
                            {getFieldIcon(item.label)}
                        </span>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.label}
                        </h2>
                        <p className="text-sm font-medium text-foreground truncate" title={String(item.value)}>
                            {item.value || <span className="text-muted-foreground/50 italic">N/A</span>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InfoGrid;