import React from "react";
import TeamCard from "./TeamCard/TeamCard";
import type { EditTeamPayload } from "../../../features/manager/managerTypes";
import type { Team } from "./Types";

interface TeamsGridProps {
    teams: Team[];
    handlers: {
        edit: (teamId: string, updatedData: EditTeamPayload) => void;
        delete: (teamId: string) => void;
    };
}

export const TeamsGrid: React.FC<TeamsGridProps> = ({ teams, handlers }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => (
            <TeamCard
                key={team._id}
                index={index}
                {...team}
                onEdit={(updatedData) => handlers.edit(team._id, updatedData)}
                onDelete={() => handlers.delete(team._id)}
            />
        ))}
    </div>
);