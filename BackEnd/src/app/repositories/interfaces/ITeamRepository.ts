import { Filters, TeamData, TeamRegister } from "domain/dtos/Team.dto";

export interface ITeamRepository {
    findByName(name: string): Promise<TeamData | null>;
    findById(id: string): Promise<TeamData | null>;
    findAllWithFilters(filters: Filters): Promise<TeamData[]>;
    findAll(managerId: string): Promise<TeamData[]>;
    togglePlayerStatus(teamId: string, playerId: string): Promise<TeamData | null>;
    create(teamData: TeamRegister): Promise<TeamData>;
    addMember(teamId: string, playerId: string): Promise<TeamData>;
    update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamData>;
}