import { Plus } from 'lucide-react';

interface TournamentsHeaderProps {
    onCreateClick: () => void;
    userName?: string;
}

export default function TournamentsHeader({ onCreateClick, userName = "Manager" }: TournamentsHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                    Tournament Dashboard
                </h1>
                <p className="text-neutral-400 text-sm">
                    Welcome back, {userName}. Manage your leagues and track progress.
                </p>
            </div>
            
            <button
                onClick={onCreateClick}
                className="group flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-neutral-900 font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
            >
                <Plus size={20} className="group-hover:scale-110 transition-transform" />
                <span>Create Tournament</span>
            </button>
        </div>
    );
}