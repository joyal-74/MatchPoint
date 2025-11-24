import React from "react";

interface StatusBadgeProps {
    isActive?: boolean;
    className?: string;
    activeText?: string;
    inactiveText?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    isActive,
    className = "",
    activeText = "Active",
    inactiveText = "Blocked"
}) => {
    return (
        <span
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${isActive
                ? "px-4 bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-success)]/30"
                : "bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-[var(--color-error)]/30"
                } ${className}`}
        >
            {isActive ? activeText : inactiveText}
        </span>
    );
};

export default StatusBadge;