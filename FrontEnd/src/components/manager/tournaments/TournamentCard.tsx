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

const TournamentCard: React.FC<TournamentCardProps> = ({
    tournament,
    type,
    onAction,
    onEdit,
    onCancel,
}) => {
    if (!tournament) return null;

    const { _id, title, startDate, location, maxTeams, currTeams, entryFee, prizePool, status } = tournament;

    // --- LOGIC ---
    const isManage = type === "manage";
    const isEnded = status === "completed";
    const isOngoing = status === "ongoing";

    const formattedDate = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const progressPercent = Math.min((currTeams / maxTeams) * 100, 100);

    // --- STYLES ---
    // Base classes using Semantic Variables
    const baseClasses = "relative w-full rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden";

    // Manage: Clean, utilitarian look
    const manageStyle = "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5";
    
    // Explore: Gradient hint using the Primary color
    const exploreStyle = "bg-gradient-to-br from-card to-muted border-border hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50";

    const cardClasses = isManage ? manageStyle : exploreStyle;

    

    // Render "Ended" State (Dimmed)
    if (isEnded) {
        return (
            <div className={`w-full rounded-xl border border-border bg-muted/50 p-5 opacity-75 grayscale hover:grayscale-0 transition-all cursor-default`}>
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border mb-2">
                            {status}
                        </span>
                        <h3 className="text-base font-bold text-foreground line-clamp-1">{title}</h3>
                    </div>
                    <div className="text-muted-foreground">
                        <Trophy size={18} />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground">
                    <FaRupeeSign className="mr-1" size={12} /> {prizePool.toLocaleString()}
                    <span className="mx-2 text-border">|</span>
                    <span className="text-xs">{formattedDate}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${baseClasses} ${cardClasses} group p-5`}>

            {/* Top Row: Status Badge & Admin Actions */}
            <div className="flex items-start justify-between mb-4">
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors
                    ${isOngoing 
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" // Live is always Red (Destructive/Alert)
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                    {isOngoing && (
                        <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                    {status}
                </div>

                {isManage && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(); }} 
                                className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                title="Edit Tournament"
                            >
                                <Edit3 size={14} />
                            </button>
                        )}
                        {onCancel && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onCancel(_id); }} 
                                className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                title="Cancel Tournament"
                            >
                                <XCircle size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
                    {title}
                </h3>

                {/* Highlighted Prize Pool using Primary Color */}
                <div className="flex items-baseline gap-1 text-primary mt-1">
                    <Trophy size={14} className="opacity-80" />
                    <span className="text-lg font-bold font-mono tracking-tight">₹{prizePool.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-1 font-sans">Prize Pool</span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground mb-5">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground/70" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground/70" />
                    <span className="truncate max-w-[100px]">{location}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                    <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-border bg-muted">
                        <FaRupeeSign size={8} className="text-muted-foreground" />
                    </div>
                    <span className={Number(entryFee) === 0 ? "text-green-500 font-medium" : "text-foreground"}>
                        {Number(entryFee) === 0 ? "Free Entry" : `₹${entryFee} Entry`}
                    </span>
                </div>
            </div>

            {/* Progress Section */}
            <div className="mt-auto">
                <div className="flex justify-between items-end mb-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users size={12} />
                        <span>Teams Joined</span>
                    </div>
                    <span className={`${currTeams >= maxTeams ? 'text-destructive' : 'text-foreground'} font-mono font-bold`}>
                        {currTeams}<span className="text-muted-foreground">/</span>{maxTeams}
                    </span>
                </div>

                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-4">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${isOngoing ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={onAction}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm
                        ${isManage
                            ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:gap-3"
                        }`}
                >
                    {isManage ? 'Manage Tournament' : 'View Details'}
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default TournamentCard;