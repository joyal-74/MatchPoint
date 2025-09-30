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
        <div className={`flex items-center text-sm text-neutral-300 ${className}`}>
            <span className={`mr-2 ${iconClassName}`}>
                {icon}
            </span>
            <span className={textClassName}>
                {children}
            </span>
        </div>
    );
}