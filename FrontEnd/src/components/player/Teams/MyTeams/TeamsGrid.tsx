import React, { useState } from "react";
import TeamCard from "./TeamCard";
import type { Team } from "../Types";
import ConfirmTeamModal from "../../../shared/modal/ConfirmTeamModal";

interface TeamsGridProps {
    teams: Team[];
}

export const TeamsGrid: React.FC<TeamsGridProps> = ({ teams }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    const handleLeaveRequest = (teamId: string) => {
        setSelectedTeamId(teamId);
        setConfirmOpen(true);
    };

    const handleLeaveConfirm = () => {
        if (selectedTeamId) {
            console.log("User left team:", selectedTeamId);
            // Call API or state update here
            setConfirmOpen(false);
            setSelectedTeamId(null);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team, index) => (
                    <TeamCard
                        key={team._id}
                        index={index}
                        logo={team.logo}
                        _id={team._id}
                        name={team.name}
                        managerId={team.managerId}
                        sport={team.sport}
                        membersCount={team.membersCount}
                        maxPlayers={team.maxPlayers.toString()}
                        created={team.createdAt}
                        onLeaveRequest={handleLeaveRequest}
                    />
                ))}
            </div>

            {confirmOpen && selectedTeamId && (
                <ConfirmTeamModal
                    title="Leave Team"
                    message="Are you sure you want to leave this team?"
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={handleLeaveConfirm}
                />
            )}
        </>
    );
};
