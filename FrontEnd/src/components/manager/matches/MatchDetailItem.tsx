import React from "react";

export const MatchDetailItem: React.FC<{ label: string; value: string | number }> = React.memo(({ label, value }) => (
    <div className="flex justify-between items-center px-5 py-3 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <span className="text-foreground text-sm font-semibold text-right max-w-[60%] truncate">{value}</span>
    </div>
));