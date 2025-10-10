import { Filters, TeamData, TeamDataFull, TeamDataSummary, TeamRegister } from "domain/dtos/Team.dto";

export interface ITeamRepository {
    findByName(name: string): Promise<TeamData | null>;
    findById(id: string): Promise<TeamDataFull | null>;
    findAllWithFilters(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
    findAllWithUserId(userId: string): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
    findAll(managerId: string): Promise<TeamDataFull[]>;
    togglePlayerStatus(teamId: string, playerId: string): Promise<TeamData | null>;
    create(teamData: TeamRegister): Promise<TeamData>;
    addMember(teamId: string, userId: string, playerId: string): Promise<TeamData>;
    update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamData>;
}