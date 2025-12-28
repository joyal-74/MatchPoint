import React from "react";

interface StatusBadgeProps {
    isActive?: boolean;
    className?: string;
    activeText?: string;
    inactiveText?: string;
    showDot?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    isActive = false,
    className = "",
    activeText = "Active",
    inactiveText = "Blocked",
    showDot = true
}) => {

    // 1. Define base styles
    const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200";

    // 2. Define Variant Styles
    const activeStyles = `
        bg-emerald-500/10 border-emerald-500/20 text-emerald-700 
        dark:text-emerald-400 dark:border-emerald-400/20
    `;

    const inactiveStyles = `
        bg-destructive/10 border-destructive/20 text-destructive 
        dark:text-red-400 dark:border-red-400/20
    `;

    // 3. Dot Styles
    const dotBase = "w-1.5 h-1 rounded-full";
    const activeDot = "bg-emerald-500 dark:bg-emerald-400 animate-pulse";
    const inactiveDot = "bg-destructive dark:bg-red-400";

    return (
        <span
            className={`
                ${baseStyles} 
                ${isActive ? activeStyles : inactiveStyles} 
                ${className}
            `}
        >
            {showDot && (
                <span className={`${dotBase} ${isActive ? activeDot : inactiveDot}`} />
            )}
            {isActive ? activeText : inactiveText}
        </span>
    );
};

export default StatusBadge;