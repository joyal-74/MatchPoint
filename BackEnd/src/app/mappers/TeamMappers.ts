import { TeamData } from "domain/dtos/Team.dto";

export class TeamMapper {
    static toTeamDTO(team: TeamData): TeamData {
        return {
            _id: team._id,
            teamId: team.teamId,
            managerId: team.managerId,
            name: team.name,
            logo: team.logo,
            sport: team.sport,
            description: team.description,
            maxPlayers: team.maxPlayers,
            members: team.members,
            status: team.status,
            created: team.created
        };
    }

    static toTeamDTOs(teams: TeamData[]): TeamData[] {
        return teams.map(team => this.toTeamDTO(team));
    }
}
