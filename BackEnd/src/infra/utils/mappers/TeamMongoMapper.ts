import { MapMember, TeamDataFull, TeamDataSummary, TeamMember } from "domain/dtos/Team.dto";
import { TeamDocument } from "infra/databases/mongo/models/TeamModel";


export type TeamPopulatedDocument = Omit<TeamDocument, "members"> & {
    members: MapMember[];
};

export class TeamMongoMapper {
    static toDomainSummary(team: TeamDocument): TeamDataSummary {
        return {
            _id: team._id.toString(),
            managerId: team.managerId.toString(),
            teamId: team.teamId,
            name: team.name,
            logo: team.logo,
            sport: team.sport,
            state: team.state,
            city: team.city,
            description: team.description,
            membersCount: team.members.length,
            maxPlayers: team.maxPlayers,
            status: team.status,
            phase: team.phase,
            stats: team.stats,
            createdAt: team.createdAt,
        };
    }

    static toDomainSummaryArray(teams: TeamDocument[]): TeamDataSummary[] {
        return teams.map(this.toDomainSummary);
    }

    static toDomainFull(team: TeamPopulatedDocument): TeamDataFull {
        const members: TeamMember[] = team.members.map((m) => ({
            playerId: m.playerId._id.toString(),
            userId: m.userId._id.toString(),
            firstName: m.userId.first_name,
            lastName: m.userId.last_name,
            email: m.userId.email,
            profile: m.playerId.profile,
            stats: m.playerId.stats,
            status: m.status,
            approvalStatus: m.approvalStatus
        }));

        return {
            _id: team._id.toString(),
            teamId: team.teamId,
            managerId: team.managerId.toString(),
            name: team.name,
            logo: team.logo,
            sport: team.sport,
            state: team.state,
            city: team.city,
            description: team.description,
            maxPlayers: team.maxPlayers,
            members,
            membersCount: team.members.length,
            status: team.status,
            phase: team.phase,
            stats: team.stats,
            createdAt: team.createdAt,
        };
    }

        static toDomainFullArray(teams: TeamPopulatedDocument[]): TeamDataFull[] {
        return teams.map(this.toDomainFull);
    }
}
