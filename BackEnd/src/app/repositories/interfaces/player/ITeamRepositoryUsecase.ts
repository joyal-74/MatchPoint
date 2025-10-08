import { Filters, TeamData, TeamDataSummary } from "domain/dtos/Team.dto";

export interface IGetAllTeamsUseCase {
    execute(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
}

export interface IGetMyTeamsUseCase {
    execute(playerId: string): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
}

export interface IGetMyTeamDetailsUseCase {
    execute(teamId: string): Promise<TeamData>;
}

export interface IJoinTeamUseCase {
    execute(playerId: string, teamId: string): Promise<TeamData>;
}