interface StatsTableProps {
    title: string;
    fields: { label: string; key: string }[];
    data: Record<string, any> | undefined;
}

const StatsTable = ({ title, fields, data }: StatsTableProps) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center mb-6 border-l-4 border-primary pl-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">
                    {title}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                {fields.map((field) => (
                    <div
                        key={field.key}
                        className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/30 transition-colors px-2 rounded-sm"
                    >
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {field.label}
                        </span>
                        <span className="text-lg font-bold text-foreground tabular-nums">
                            {data?.[field.key] ?? '0'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsTable;