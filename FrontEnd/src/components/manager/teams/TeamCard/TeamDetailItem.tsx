import type { ReactNode } from 'react';

export interface TeamDetailItemProps {
    icon: ReactNode;
    children: ReactNode;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

export default function TeamDetailItem({
    icon,
    children,
    className = "",
    iconClassName = "",
    textClassName = ""
}: TeamDetailItemProps) {
    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            <span className={`flex-shrink-0 flex items-center justify-center text-muted-foreground ${iconClassName}`}>
                {icon}
            </span>
            <span className={`truncate text-muted-foreground ${textClassName}`}>
                {children}
            </span>
        </div>
    );
}