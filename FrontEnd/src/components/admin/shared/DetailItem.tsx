import { Copy } from "lucide-react";

export const StatusBadge = ({ status }: { status?: string }) => {
    // Keeping semantic colors for status, but using theme opacity utilities where possible
    const styles = {
        active: "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20",
        blocked: "bg-destructive/10 text-destructive border-destructive/20",
        pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20"
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${styles[status as keyof typeof styles] || styles.pending}`}>
            {status}
        </span>
    );
};


export const DetailItem = ({ label, status, value, copyable, isBadge }: { label: string, status?: string, value: string, copyable?: boolean, isBadge?: boolean }) => {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                {isBadge ? (
                    <StatusBadge status={status} />
                ) : (
                    <span className="text-sm font-medium text-foreground truncate">{value}</span>
                )}
                {copyable && <Copy className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-primary" onClick={() => navigator.clipboard.writeText(value)} />}
            </div>
        </div>
    )
};