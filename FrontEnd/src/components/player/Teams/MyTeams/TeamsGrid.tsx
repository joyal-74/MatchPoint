import React from "react";

import TeamCard from "./TeamCard";
import type { Team } from "../Types";

interface TeamsGridProps {
    teams: Team[];
    onLeft: (id: string) => void;
}

export const TeamsGrid: React.FC<TeamsGridProps> = ({ teams, onLeft }) => {

    return (
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
                    onLeft={onLeft}
                />
            ))}
        </div>
    );
};
