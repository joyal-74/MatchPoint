export interface StatusBadgeProps {
    status: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
    const isActive = status === true;
    
    // Size variants
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px] gap-1',
        md: 'px-2.5 py-1 text-xs gap-1.5',
        lg: 'px-3 py-1.5 text-sm gap-2'
    };

    // Color variants using Semantic Theme Tokens
    const statusClasses = isActive 
        ? 'bg-primary/10 text-primary border-primary/20' 
        : 'bg-muted text-muted-foreground border-border';

    // Dot size mapping
    const dotSizes = {
        sm: 'w-1 h-1',
        md: 'w-1.5 h-1.5',
        lg: 'w-2 h-2'
    };

    return (
        <span 
            className={`
                inline-flex items-center justify-center rounded-full border font-medium transition-colors duration-200
                ${sizeClasses[size]} 
                ${statusClasses} 
                ${className}
            `}
        >
            {/* Status Indicator Dot */}
            <span className="relative flex items-center justify-center">
                <span 
                    className={`
                        rounded-full 
                        ${isActive ? 'bg-primary' : 'bg-muted-foreground/40'}
                        ${dotSizes[size]}
                    `} 
                />
                {isActive && (
                    <span 
                        className={`
                            absolute inline-flex rounded-full opacity-75 animate-ping 
                            bg-primary 
                            ${dotSizes[size]}
                        `} 
                    />
                )}
            </span>

            {isActive ? "Active" : "Inactive"}
        </span>
    );
}