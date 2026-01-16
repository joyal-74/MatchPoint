export const UserAvatar = ({ src, name, size = "md", status }: { src?: string; name?: string; size?: "sm" | "md" | "lg"; status?: boolean }) => {
    const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };

    // Status now uses 'bg-primary' for online to match your theme color
    const statusColor = status ? "bg-primary" : "bg-muted-foreground";

    return (
        <div className="relative inline-block">
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center font-semibold text-muted-foreground`}>
                {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : (name?.[0]?.toUpperCase() || "?")}
            </div>
            {status !== undefined && (
                <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} ring-2 ring-card rounded-full`} />
            )}
        </div>
    );
};