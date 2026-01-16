import { Plus } from 'lucide-react';

interface TournamentsHeaderProps {
    onCreateClick: () => void;
    userName?: string;
}

export default function TournamentsHeader({ onCreateClick, userName = "Manager" }: TournamentsHeaderProps) {
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
            
            {/* Primary Action Button using Theme Variables */}
            <button
                onClick={onCreateClick}
                className="group flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95"
            >
                <Plus size={20} className="group-hover:scale-110 transition-transform" />
                <span>Create Tournament</span>
            </button>
        </div>
    );
}