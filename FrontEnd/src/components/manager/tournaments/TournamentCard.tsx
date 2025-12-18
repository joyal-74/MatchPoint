import React from "react";
import { Calendar, MapPin, Edit3, XCircle, ArrowRight, Trophy, Users } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import type { Tournament } from "../../../features/manager/managerTypes";

interface TournamentCardProps {
    tournament: Tournament;
    type: "manage" | "explore";
    index: number;
    onEdit?: () => void;
    onAction: () => void;
    onCancel?: (id: string) => void;
}

// Themes now include gradients for a more premium look
const THEMES = [
    {
        name: "Blue",
        badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        border: "border-blue-500/20 hover:border-blue-400",
        gradient: "from-blue-500/5 via-transparent to-transparent",
        icon: "text-blue-400"
    },
    {
        name: "Purple",
        badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        border: "border-purple-500/20 hover:border-purple-400",
        gradient: "from-purple-500/5 via-transparent to-transparent",
        icon: "text-purple-400"
    },
    {
        name: "Emerald",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        border: "border-emerald-500/20 hover:border-emerald-400",
        gradient: "from-emerald-500/5 via-transparent to-transparent",
        icon: "text-emerald-400"
    },
    {
        name: "Orange",
        badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        border: "border-orange-500/20 hover:border-orange-400",
        gradient: "from-orange-500/5 via-transparent to-transparent",
        icon: "text-orange-400"
    },
];

const TournamentCard: React.FC<TournamentCardProps> = ({
    tournament,
    type,
    index,
    onAction,
    onEdit,
    onCancel,
}) => {
    if (!tournament) return null;

    const { _id, title, startDate, location, maxTeams, currTeams, entryFee, prizePool, status } = tournament;

    // --- LOGIC ---
    const isManage = type === "manage";
    const isEnded = status === "ended";
    const isOngoing = status === "ongoing";

    const theme = THEMES[index % THEMES.length];

    const formattedDate = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const progressPercent = Math.min((currTeams / maxTeams) * 100, 100);

    // --- STYLES ---
    // Base background with a subtle gradient overlay based on theme
    const baseClasses = "relative w-full rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden";

    const manageStyle = "bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-900/50";
    const exploreStyle = `bg-neutral-900 ${theme.border} hover:-translate-y-1 hover:shadow-lg hover:shadow-${theme.name.toLowerCase()}-900/20 bg-gradient-to-br ${theme.gradient}`;

    const cardClasses = isManage ? manageStyle : exploreStyle;

    // Render "Ended" State (Dimmed but clean)
    if (isEnded) {
        return (
            <div className={`w-full rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 opacity-75 grayscale hover:grayscale-0 transition-all`}>
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-400 border border-neutral-700 mb-2">
                            {status}
                        </span>
                        <h3 className="text-base font-bold text-neutral-300 line-clamp-1">{title}</h3>
                    </div>
                    <div className="text-neutral-500">
                        <Trophy size={18} />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-neutral-400">
                    <FaRupeeSign className="mr-1" size={12} /> {prizePool.toLocaleString()}
                    <span className="mx-2 text-neutral-700">|</span>
                    <span className="text-xs">{formattedDate}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${baseClasses} ${cardClasses} group p-5`}>

            {/* Top Row: Status Badge & Admin Actions */}
            <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isOngoing ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        isManage ? "bg-neutral-800 text-neutral-400 border-neutral-700" :
                            theme.badge
                    }`}>
                    {isOngoing && (
                        <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                    {status}
                </div>

                {isManage && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors">
                                <Edit3 size={14} />
                            </button>
                        )}
                        {onCancel && (
                            <button onClick={(e) => { e.stopPropagation(); onCancel(_id); }} className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-red-900/30 hover:text-red-400 transition-colors">
                                <XCircle size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">
                    {title}
                </h3>

                {/* Highlighted Prize Pool */}
                <div className="flex items-baseline gap-1 text-amber-400 mt-1">
                    <Trophy size={14} className="opacity-80" />
                    <span className="text-lg font-bold font-mono tracking-tight">₹{prizePool.toLocaleString()}</span>
                    <span className="text-xs text-neutral-500 ml-1 font-sans">Prize Pool</span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-neutral-400 mb-5">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neutral-600" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-neutral-600" />
                    <span className="truncate max-w-[100px]">{location}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                    <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-neutral-700 bg-neutral-800">
                        <FaRupeeSign size={8} className="text-neutral-400" />
                    </div>
                    <span className={Number(entryFee) === 0 ? "text-emerald-400 font-medium" : "text-neutral-300"}>
                        {Number(entryFee) === 0 ? "Free Entry" : `₹${entryFee} Entry`}
                    </span>
                </div>
            </div>

            {/* Progress Section */}
            <div className="mt-auto">
                <div className="flex justify-between items-end mb-2 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                        <Users size={12} />
                        <span>Teams Joined</span>
                    </div>
                    <span className={`${currTeams >= maxTeams ? 'text-red-400' : 'text-white'} font-mono font-bold`}>
                        {currTeams}<span className="text-neutral-600">/</span>{maxTeams}
                    </span>
                </div>

                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden mb-4">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${isOngoing ? 'bg-emerald-500' : theme.icon.replace('text-', 'bg-')
                            }`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Action Button */}
                <button
                onClick={onAction}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 
                    ${isManage
                        ? "bg-neutral-800 text-white hover:bg-neutral-700"
                        : "bg-white text-black hover:bg-neutral-200 hover:gap-3"
                    }`}>
                    {isManage ? 'Manage Tournament' : 'View Details'}
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default TournamentCard;