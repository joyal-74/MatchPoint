import type { Match } from "../../../../../../../features/manager/managerTypes";

interface MatchCardProps {
    match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {


    const getStatusStyle = () => {
        switch (match.status) {
            case "completed": return "bg-green-500/20 text-green-300";
            case "ongoing": return "bg-yellow-500/20 text-yellow-300";
            case "bye": return "bg-gray-500/20 text-gray-300 italic";
            default: return "bg-blue-500/20 text-blue-300";
        }
    };

    return (
        <div className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-100">
                    Match {match.matchNumber}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle()}`}>
                    {match.status}
                </span>
            </div>
            <div className="mt-3 text-center text-sm text-neutral-300">
                <p>{match.teamA}</p>
                <p className="text-xs text-neutral-500 my-1">vs</p>
                <p>{match.teamB}</p>
            </div>
        </div>
    );
}
