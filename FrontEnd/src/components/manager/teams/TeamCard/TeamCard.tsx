import type { EditTeamPayload, Members } from "../../../../features/manager/managerTypes";
import ColorAccentBar from "./ColorAccentBar";
import TeamDetailItem from "./TeamDetailItem";
import TeamInfo from "./TeamInfo";
import TeamLogo from "./TeamLogo";
import type { MenuAction } from "./TeamMenu";
import TeamMenu from "./TeamMenu";

export interface TeamCardProps {
    _id: string;
    name: string;
    sport: string;
    members: Members[];
    created: string;
    maxPlayers: number;
    managerId: string
    status: boolean;
    logo?: string;
    onEdit: (id: EditTeamPayload) => void;
    onDelete: (id: string) => void;
    onManageMembers: (id: string) => void;
    className?: string;
}

export default function TeamCard({ _id, name, sport, members, created, status, logo, managerId, maxPlayers, onEdit, onDelete, onManageMembers, className = "" }: TeamCardProps) {
    const handleMenuAction = (action: MenuAction): void => {
        switch (action) {
            case 'manage':
                onManageMembers(_id);
                break;
            case 'delete':
                onDelete(_id);
                break;
            default:
                break;
        }
    };

    return (
        <div className={`bg-neutral-800/50 rounded-xl border border-neutral-700/50 overflow-hidden transition-all duration-300 hover:border-neutral-600/50 ${className}`}>
            <ColorAccentBar id={_id} />

            <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                    <TeamLogo logo={logo} name={name} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <TeamInfo name={name} sport={sport} />

                            <TeamMenu
                                onAction={handleMenuAction}
                                members={members}
                                teamId={_id}
                                onEdit={onEdit}
                                name={name}
                                managerId={managerId}
                                sport={sport}
                                status={status}
                                logo={logo}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mt-4">
                    <TeamDetailItem
                        icon={
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        }
                    >
                        {members.length}/{maxPlayers} players
                    </TeamDetailItem>

                    <TeamDetailItem
                        icon={
                            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                    >
                        Created: {new Date(created).toLocaleDateString()}
                    </TeamDetailItem>
                </div>
            </div>
        </div>
    );
}