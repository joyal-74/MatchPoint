import { Pencil, Trash2 } from "lucide-react";

interface TournamentCardProps {
    title: string;
    date: string;
    venue: string;
    teams: string;
    fee: string;
    status: "Ongoing" | "Completed";
    type: "manage" | "explore";
    color: string;
}

export default function TournamentCard({
    title,
    date,
    venue,
    teams,
    fee,
    status,
    type,
    color,
}: TournamentCardProps) {
    // Gradient backgrounds based on status and type
    const getCardGradient = () => {
        if (status === "Completed") {
            return "from-neutral-800/80 to-neutral-700/60 border-neutral-700";
        }

        // Different gradients based on the accent color
        const gradientMap: { [key: string]: string } = {
            "bg-green-700": "from-green-900/30 to-emerald-800/20 border-green-700/30",
            "bg-red-700": "from-red-900/30 to-rose-800/20 border-red-700/30",
            "bg-purple-700": "from-purple-900/30 to-violet-800/20 border-purple-700/30",
            "bg-orange-700": "from-orange-900/30 to-amber-800/20 border-orange-700/30",
            "bg-pink-700": "from-pink-900/30 to-rose-800/20 border-pink-700/30",
            "bg-amber-700": "from-amber-900/30 to-yellow-800/20 border-amber-700/30",
        };

        return gradientMap[color] || "from-neutral-800/80 to-neutral-700/60 border-neutral-700";
    };

    return (
        <div className={`group relative p-6 rounded-2xl border backdrop-blur-sm bg-gradient-to-br ${getCardGradient()} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color.replace('bg-', 'from-')}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-white pr-2 line-clamp-2 leading-tight">
                        {title}
                    </h3>
                    {type === "manage" && (
                        <div className="flex gap-2 flex-shrink-0">
                            <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                <Pencil size={16} className="text-white" />
                            </button>
                            <button className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/50 transition-colors">
                                <Trash2 size={16} className="text-white" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-200">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-xs">📅</span>
                        </div>
                        <span>{date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-200">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-xs">📍</span>
                        </div>
                        <span className="line-clamp-1">{venue}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-200">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-xs">👥</span>
                        </div>
                        <span>{teams}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-200">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-xs">💰</span>
                        </div>
                        <span>{fee} Entry Fee</span>
                    </div>
                </div>

                {/* Status and Action Button */}
                <div className="flex items-center justify-between mt-4">
                    <div
                        className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm ${status === "Ongoing"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-neutral-600/20 text-neutral-300 border border-neutral-600/30"
                            }`}
                    >
                        {status}
                    </div>

                    {type === "explore" && (
                        <button
                            disabled={status === "Completed"}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${status === "Completed"
                                ? "bg-neutral-600/30 text-neutral-400 cursor-not-allowed"
                                : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                                }`}
                        >
                            {status === "Completed" ? "Ended" : "Register"}
                        </button>
                    )}

                    {type === "manage" && (
                        <button
                            disabled={status === "Completed"}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${status === "Completed"
                                ? "bg-neutral-600/30 text-neutral-400 cursor-not-allowed"
                                : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                                }`}
                        >
                            View Details
                        </button>
                    )}


                </div>

            </div>
        </div>
    );
}