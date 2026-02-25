import { Plus } from "lucide-react";

interface HeaderProps {
    userName: string;
    showCreateButton: boolean;
    onCreate?: () => void;

}

export default function TournamentsHeader({ userName, showCreateButton, onCreate }: HeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                    Tournament Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                    Welcome back, {userName}. Manage your leagues and track progress.
                </p>
            </div>

            {showCreateButton && (
                <button
                    onClick={onCreate}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    <span>Create Tournament</span>
                </button>
            )}
        </div>
    );
}