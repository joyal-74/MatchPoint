export const TeamLogo = ({ url, name }: { url?: string; name: string }) => (
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted/50 border border-border shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
        {url ? (
            <img src={url} alt={name} className="w-full h-full object-cover" />
        ) : (
            <span className="text-xs font-bold text-muted-foreground">{name?.charAt(0)}</span>
        )}
    </div>
);