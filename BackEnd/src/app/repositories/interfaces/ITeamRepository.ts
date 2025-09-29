import { TeamData, TeamRegister } from "domain/dtos/Team.dto";

export interface ITeamRepository {
    findByName(name: string): Promise<TeamData | null>;
    findById(id: string): Promise<TeamData | null>;
    findAll(managerId: string): Promise<TeamData[]>;
    togglePlayerStatus(teamId: string, playerId: string): Promise<TeamData | null>;
    create(teamData: TeamRegister): Promise<TeamData>;
    update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamData | null>;
}