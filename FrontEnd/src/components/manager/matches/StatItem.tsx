import React from "react";

export const StatItem: React.FC<{ label: string; value: string | number }> = React.memo(({ label, value }) => (
    <p>
        <span className="font-medium text-neutral-400">{label}:</span>{' '}
        <span className="font-semibold text-neutral-100">{value}</span>
    </p>
));