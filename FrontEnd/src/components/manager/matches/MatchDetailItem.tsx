import React from "react";

export const MatchDetailItem: React.FC<{ label: string; value: string | number }> = React.memo(({ label, value }) => (
    <div className="grid grid-cols-2 py-2 border-b border-neutral-700 last:border-b-0">
        <span className="text-neutral-400 text-sm font-medium">{label}</span>
        <span className="text-white text-sm font-semibold text-right">{value}</span>
    </div>
));