export const DateCell = ({ date }: { date: string | Date }) => (
    <span className="font-mono text-xs text-muted-foreground">
        {new Date(date).toLocaleDateString()}
    </span>
);