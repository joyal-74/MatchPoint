import React from "react";

export const StatItem: React.FC<{ label: string; value: string | number }> = React.memo(({ label, value }) => (
    <div className="flex flex-col items-center justify-center bg-muted/30 border border-border/50 rounded-lg p-2 min-w-[70px] transition-colors hover:bg-muted/50">
        <span className="text-lg font-bold text-foreground leading-none mb-1">
            {value}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            {label}
        </span>
    </div>
));