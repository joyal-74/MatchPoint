export interface StatusBadgeProps {
    status: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
    const isActive = status === true;
    
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm'
    };

    const statusClasses = isActive 
        ? 'bg-green-500/20 text-green-400' 
        : 'bg-neutral-500/20 text-neutral-400';

    return (
        <span className={`${sizeClasses[size]} ${statusClasses} rounded-full font-medium ${className}`}>
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}