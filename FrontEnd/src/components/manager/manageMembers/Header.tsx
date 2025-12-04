import type { Team } from "../teams/Types";

interface HeaderProps {
    team: Team;
    playersCount: number;
    onAddPlayerClick: () => void;
}

export function Header({ team, playersCount, onAddPlayerClick }: HeaderProps) {

    const handleAddPlayerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onAddPlayerClick();
    };
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                    Manage Your Team
                </h1>
                <p className="text-neutral-400 mt-2">
                    {team?.name} • {playersCount}/{team?.maxPlayers || 0} Players
                </p>
            </div>
            <div className="flex gap-3 items-center">
                
                <button 
                onClick={handleAddPlayerClick}
                className="bg-gradient-to-r from-emerald-500 to-green-600 py-2 px-3 rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                    Add Player +
                </button>
            </div>
        </div>
    );
}