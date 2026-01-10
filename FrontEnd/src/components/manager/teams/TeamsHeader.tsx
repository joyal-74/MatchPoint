import { Plus } from "lucide-react";

interface TeamsHeaderProps {
    onCreateClick: () => void;
    title?: string;
    subtitle?: string;
    buttontitle?: string;
}

export default function ManagementHeader({
    onCreateClick,
    title = "Create & Manage Teams",
    subtitle = "Organize your teams & join tournaments",
    buttontitle = "Create Team",
}: TeamsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-6 rounded-xl bg-card border border-border shadow-sm transition-colors duration-200">
            <div>
                <h1 className="text-xl font-bold text-foreground mb-1 tracking-tight">
                    {title}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {subtitle}
                </p>
            </div>
            
            <button 
                onClick={onCreateClick} 
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-all rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 active:scale-95 hover:-translate-y-0.5"
            >
                <Plus size={18} strokeWidth={2.5} />
                {buttontitle}
            </button>
        </div>
    );
}