import type { TopPlayerStats } from "./leaderboardData";

interface PlayerCardProps {
    player: TopPlayerStats;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    const statLabel = player.isCentury ? '100s' : 'Century';

    return (
        <div className="bg-neutral-800 p-6 rounded-lg shadow-xl flex-1 min-w-[300px]">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-neutral-600 rounded-full mr-3 border-2 border-green-500">
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{player.name}</h3>
                        <p className="text-sm text-neutral-400">{player.handle}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm text-neutral-300">
                <p>Match : {player.matches}</p>
                <p>Runs : {player.runs}</p>
                <p>Average : {player.average}</p>
                <p>{statLabel} : {player.hundreds}</p>
                <p>Fifties : {player.fifties}</p>
                <p>Strike Rate : {player.strikeRate}</p>
            </div>
        </div>
    );
};

export default PlayerCard;