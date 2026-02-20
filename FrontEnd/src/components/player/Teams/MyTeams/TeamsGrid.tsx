import React, { useState } from "react";
import TeamCard from "./TeamCard";
import type { Team } from "../Types";
import ConfirmTeamModal from "../../../shared/modal/ConfirmTeamModal";
import { leaveTeam } from "../../../../features/player/playerThunks";
import { useAppSelector, useAppDispatch } from "../../../../hooks/hooks";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../../../utils/apiError";

interface TeamsGridProps {
    teams: Team[];
    status: 'approved' | 'pending';
}

export const TeamsGrid: React.FC<TeamsGridProps> = ({ teams, status }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<{ id: string, name: string } | null>(null);
    const userId = useAppSelector(state => state.auth.user?._id)
    const dispatch = useAppDispatch();

    const handleLeaveRequest = (teamId: string, teamName: string) => {
        setSelectedTeam({ id: teamId, name: teamName });
        setConfirmOpen(true);
    };

    const handleLeaveConfirm = async () => {
        if (selectedTeam && userId) {
            try {
                await dispatch(leaveTeam({
                    playerId: userId,
                    teamId: selectedTeam.id
                })).unwrap();

                toast.success(`Successfully left ${selectedTeam.name}`);
                setConfirmOpen(false);
                setSelectedTeam(null);

            } catch (error: unknown) {
                toast.error(getApiErrorMessage(error) || "Failed to leave the team");
            }
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
                        onLeaveRequest={() => handleLeaveRequest(team._id, team.name)}
                        status={status}
                    />
                ))}
            </div>

            {confirmOpen && selectedTeam && (
                <ConfirmTeamModal
                    title="Leave Team"
                    message={`Are you sure you want to leave ${selectedTeam.name}?`}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={handleLeaveConfirm}
                />
            )}
        </>
    );
};
