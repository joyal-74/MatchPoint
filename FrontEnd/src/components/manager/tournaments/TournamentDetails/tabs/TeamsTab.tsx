import { useState } from "react";
import { Users, Calendar, Crown, Search, ChevronRight } from "lucide-react";
import type { RegisteredTeam } from "./TabContent";
import TeamDetailsModal from "./TeamDetailsModal";

interface TeamsTabProps {
    registeredTeams: RegisteredTeam[];
}

export default function TeamsTab({ registeredTeams }: TeamsTabProps) {
    const [selectedTeam, setSelectedTeam] = useState<RegisteredTeam | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (team: RegisteredTeam) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedTeam(null);
        setIsModalOpen(false);
    };

    // Helper to generate team initials
    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (registeredTeams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
                    <Users size={32} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Teams Registered</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-xs text-center">
                    Share the tournament link to start accepting team registrations.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        Team Roster
                        <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs text-muted-foreground font-mono">
                            {registeredTeams.length}
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage and view all participating squads</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Find a team..." 
                        className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
                    />
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {registeredTeams.map((team, i) => (
                    <div
                        key={i}
                        onClick={() => openModal(team)}
                        className="group relative bg-card hover:bg-muted/30 rounded-2xl p-5 border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg flex flex-col"
                    >
                        {/* Top Row: Rank & Status */}
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] text-muted-foreground border border-border bg-muted/50 px-2 py-1 rounded-md">
                                #{String(i + 1).padStart(2, '0')}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
                                <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Center: Avatar & Name */}
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                    {getInitials(team.name)}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1 w-full" title={team.name}>
                                {team.name}
                            </h3>
                            <span className="text-xs text-muted-foreground font-medium mt-1">Confirmed Squad</span>
                        </div>

                        {/* Bottom: Info Grid */}
                        <div className="mt-auto pt-4 border-t border-border grid grid-cols-2 gap-2 text-xs">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Crown size={12} className="text-amber-500" />
                                    Captain
                                </span>
                                <span className="text-foreground/80 font-medium truncate" title={team.captain}>
                                    {team.captain}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 items-end text-right">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    Joined
                                </span>
                                <span className="text-foreground/80 font-medium">
                                    {formatDate(team.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <TeamDetailsModal
                team={selectedTeam}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
}