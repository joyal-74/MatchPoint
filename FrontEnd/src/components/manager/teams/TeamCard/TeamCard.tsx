import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, ArrowRight } from "lucide-react";
import type { EditTeamPayload } from "../../../../features/manager/managerTypes";
import TeamDetailItem from "./TeamDetailItem";
import TeamInfo from "./TeamInfo";
import TeamLogo from "./TeamLogo";
import TeamMenu from "./TeamMenu";
import { getColorScheme } from "./TeamColors"; 
import type { TeamStatus } from "../Types";

export interface TeamCardProps {
    _id: string;
    name: string;
    sport: string;
    membersCount: number;
    createdAt: string;
    maxPlayers: string;
    managerId: string;
    status: TeamStatus;
    logo?: string;
    state: string;
    city: string;
    index: number;
    onEdit: (id: EditTeamPayload) => void;
    onDelete: (id: string) => void;
    className?: string;
}

export default function TeamCard({ 
    _id, 
    name, 
    sport, 
    membersCount, 
    createdAt, 
    status, 
    state,
    city,
    logo, 
    managerId, 
    maxPlayers, 
    index,
    onEdit, 
    onDelete, 
    className = "" 
}: TeamCardProps) {

    // Get color scheme based on index
    const colorScheme = getColorScheme(index);
    const navigate = useNavigate();

    return (
        <div className={`relative group ${className}`}>
            
            {/* Semantic Card Container */}
            <div className={`
                relative flex flex-col h-full
                bg-card text-card-foreground
                rounded-xl border border-border
                overflow-hidden transition-all duration-300 
                hover:shadow-lg hover:border-primary/50
                group-hover:-translate-y-1
            `}>
                
                {/* Top Accent Bar (Uses Color Scheme) */}
                <div className={`h-1.5 w-full ${colorScheme.bg || 'bg-primary'}`} />

                <div className="p-5 flex-1 flex flex-col">
                    {/* Header Section */}
                    <div className="flex items-start gap-4 mb-4">
                        <TeamLogo logo={logo} name={name} />
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <TeamInfo name={name} sport={sport} colorScheme={colorScheme} />

                                <TeamMenu
                                    membersCount={membersCount}
                                    teamId={_id}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    name={name}
                                    state={state}
                                    city={city}
                                    managerId={managerId}
                                    sport={sport}
                                    status={status}
                                    logo={logo}
                                    colorScheme={colorScheme}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border w-full my-4" />

                    {/* Details Section */}
                    <div className="space-y-4 mt-auto">
                        <TeamDetailItem
                            icon={<Users className={`w-4 h-4 ${colorScheme.text || 'text-primary'}`} />}
                        >
                            <span className="text-muted-foreground">
                                <span className="font-medium text-foreground">{membersCount}</span>
                                / {maxPlayers} players
                            </span>
                        </TeamDetailItem>

                        <div className="flex justify-between items-center gap-2">
                            <TeamDetailItem
                                icon={<CalendarDays className="w-4 h-4 text-muted-foreground" />}
                            >
                                <span className="text-muted-foreground text-xs">
                                    {new Date(createdAt).toLocaleDateString()}
                                </span>
                            </TeamDetailItem>

                            {/* Action Button */}
                            <button
                                type="button"
                                onClick={() => navigate(`/manager/team/${_id}`)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    bg-muted text-muted-foreground
                                    hover:bg-primary hover:text-primary-foreground
                                    group-hover:shadow-md
                                `}
                            >
                                View
                                <ArrowRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}