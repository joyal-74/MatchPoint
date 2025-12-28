import { TeamDataFull } from "domain/dtos/Team.dto";

export class TeamMapper {
    static toTeamDTO(team: TeamDataFull): TeamDataFull {
        return {
            _id: team._id,
            teamId: team.teamId,
            managerId: team.managerId,
            managerName : team.managerName,
            name: team.name,
            logo: team.logo,
            sport: team.sport,
            state: team.state,
            city: team.city,
            description: team.description,
            maxPlayers: team.maxPlayers,
            members: team.members,
            membersCount : team.membersCount,
            status: team.status,
            createdAt: team.createdAt,
            stats : team.stats,
            phase : team.phase
        };
    }

    static toTeamDTOs(teams: TeamDataFull[]): TeamDataFull[] {
        return teams.map(team => this.toTeamDTO(team));
    }
}
