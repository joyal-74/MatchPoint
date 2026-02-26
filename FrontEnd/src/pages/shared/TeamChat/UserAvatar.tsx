interface UserAvatarProps {
    src?: string;
    name?: string;
    size?: "sm" | "md" | "lg";
    status?: boolean;
    className?: string; // Add this
}

export const UserAvatar = ({ 
    src, 
    name, 
    size = "md", 
    status, 
    className = "" // Default to empty string
}: UserAvatarProps) => {
    const sizeClasses = { 
        sm: "w-8 h-8 text-xs", 
        md: "w-10 h-10 text-sm", 
        lg: "w-12 h-12 text-base" 
    };

    const statusColor = status ? "bg-primary" : "bg-muted-foreground";

    return (
        // Apply the className to the wrapper div
        <div className={`relative inline-block flex-shrink-0 ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center font-semibold text-muted-foreground`}>
                {src ? (
                    <img src={src} alt={name} className="w-full h-full object-cover" />
                ) : (
                    name?.[0]?.toUpperCase() || "?"
                )}
            </div>
            {status !== undefined && (
                <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} ring-2 ring-card rounded-full`} />
            )}
        </div>
    );
};