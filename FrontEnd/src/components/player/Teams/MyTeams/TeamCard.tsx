import SecondaryButton from "../../../ui/SecondaryButton";
import TeamDetailItem from "../../../manager/teams/TeamCard/TeamDetailItem";
import TeamInfo from "../../../manager/teams/TeamCard/TeamInfo";
import TeamLogo from "../../../manager/teams/TeamCard/TeamLogo";
import { getColorScheme } from "../../../manager/teams/TeamCard/teamColors";
import TeamMenu from "./TeamMenu";
import { useNavigate } from "react-router-dom";


export interface TeamCardProps {
    _id: string;
    name: string;
    sport: string;
    membersCount: number;
    created: string;
    maxPlayers: string;
    managerId: string;
    logo?: string;
    index: number;
    onLeft: (id: string) => void;
    className?: string;
}

export default function TeamCard({
    _id,
    name,
    sport,
    membersCount,
    created,
    logo,
    index,
    maxPlayers,
    onLeft,
    className = ""
}: TeamCardProps) {

    const colorScheme = getColorScheme(index);
    const navigate = useNavigate();

    const handleView = () => {
        console.log("clicked")
        navigate(`/player/myteam/${_id}`);
    }

    return (
        <div className={`relative group ${className}`}>
            <div className={`
                relative bg-gradient-to-br ${colorScheme.bg} backdrop-blur-sm
                rounded-xl border ${colorScheme.border} ${colorScheme.hoverBorder}
                overflow-hidden transition-all duration-300 
                hover:shadow-lg ${colorScheme.glow}
            `}>
                <div className={`h-1 ${colorScheme.accent}`} />

                <div className="p-5">
                    <div className="flex items-start gap-4 mb-4">
                        <TeamLogo logo={logo} name={name} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <TeamInfo name={name} sport={sport} colorScheme={colorScheme} />

                                <TeamMenu
                                    teamId={_id}
                                    onLeft={onLeft}
                                    colorScheme={colorScheme}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        <TeamDetailItem
                            icon={
                                <svg className={`w-5 h-5 ${colorScheme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        >
                            {membersCount}/{maxPlayers} players
                        </TeamDetailItem>

                        <div className="flex justify-between items-center">
                            <TeamDetailItem
                                icon={
                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                            >
                                Created: {new Date(created).toLocaleDateString()}
                            </TeamDetailItem>

                            <SecondaryButton
                                className={`
                                    py-1.5 px-4 text-[13px] ${colorScheme.text} ${colorScheme.hoverText} 
                                    rounded-lg font-medium text-sm transition-all duration-300 
                                    border ${colorScheme.buttonBorder} ${colorScheme.buttonHoverBorder} 
                                    ${colorScheme.buttonBg} ${colorScheme.buttonHoverBg} 
                                    disabled:opacity-50
                                `}
                                type="button"
                                onClick={handleView}
                            >
                                View
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
