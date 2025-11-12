import type { PlayerDetails } from '../Types';

const MembersList = ({ players, openPlayerDetails }: { players: PlayerDetails[]; openPlayerDetails: (player: PlayerDetails) => void; }) => {
    if (players.length === 0)
        return (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8 col-span-full">
                No players have joined yet.
            </p>
        );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
                <div
                    key={player.playerId}
                    className="group flex items-center space-x-3 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-600/50 transition-colors cursor-pointer"
                    onClick={() => openPlayerDetails(player)}
                >
                    <img
                        src={player.profileImage || '/player.png'}
                        alt={player.firstName}
                        className="w-12 h-12 rounded-full object-cover border border-neutral-300 dark:border-neutral-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-800 dark:text-white text-sm truncate">
                            {player.firstName} {player.lastName}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                            {player.profile?.position || 'No position'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MembersList;