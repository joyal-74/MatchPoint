import { TeamData, TeamMember } from "domain/dtos/Team.dto";
import { TeamDocument } from "infra/databases/mongo/models/TeamModel";

export class TeamMongoMapper {
    static toDomain(team: TeamDocument): TeamData {
        const members: TeamMember[] = team.members.map(m => ({
            playerId: m.playerId.toString(),
            status: m.status
        }));

        return {
            _id: team._id.toString(),
            teamId: team.teamId,
            managerId: team.managerId.toString(),
            name: team.name,
            logo: team.logo,
            sport: team.sport,
            description: team.description,
            maxPlayers: team.maxPlayers,
            members,
            status: team.status,
            created: team.created
        };
    }

    static toDomainArray(teams: TeamDocument[]): TeamData[] {
        return teams.map(this.toDomain);
    }
}
