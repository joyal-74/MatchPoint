import { Trophy, Calendar, Edit, Share } from "lucide-react";
import type { Tournament } from "../../../../features/manager/managerTypes";

interface TournamentHeaderProps {
    tournamentData: Tournament,
    type: "manage" | "explore";
    onClick?: () => void;
    isRegistered? : boolean;
}

export default function TournamentHeader({ tournamentData, type, onClick, isRegistered }: TournamentHeaderProps) {
    return (
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/10 backdrop-blur-sm rounded-2xl border border-green-700/30 p-6 mb-3">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{tournamentData.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-neutral-300">
                        <span className="flex items-center gap-1">
                            <Trophy size={16} className="text-amber-400" />
                            {tournamentData.sport}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={16} className="text-blue-400" />
                            {new Date(tournamentData.startDate).toLocaleDateString()} - {new Date(tournamentData.endDate).toLocaleDateString()}
                        </span>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${tournamentData.status === "ongoing"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-neutral-600/20 text-neutral-300 border border-neutral-600/30"
                                }`}
                        >
                            {tournamentData.status}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                    {type === "manage" ? (
                        <>
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Edit size={18} />
                            </button>
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Share size={18} />
                            </button>
                        </>
                    ) : (
                        isRegistered ? (
                            <button
                                disabled
                                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-green-600/30 text-green-300 border border-green-500/30 cursor-not-allowed"
                            >
                                Registered
                            </button>
                        ) : (
                            <button
                                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                onClick={onClick}
                            >
                                Register
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};