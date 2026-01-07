import { Filters, PlayerTeamResponseDTO, TeamData, TeamDataFull, TeamDataSummary } from "domain/dtos/Team.dto";

export interface IGetAllTeamsUseCase {
    execute(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
}

export interface IGetMyTeamsUseCase {
    execute(playerId: string, status: string): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
}

export interface IGetAllPlayerTeamsUseCase {
    execute(playerId: string): Promise<PlayerTeamResponseDTO>;
}

export interface IGetMyTeamDetailsUseCase {
    execute(teamId: string): Promise<TeamDataFull>;
}

export interface IJoinTeamUseCase {
    execute(playerId: string, teamId: string): Promise<TeamData>;
}

export interface IUpdatePlayerInviteStatus {
    execute(data: { playerId: string; teamId: string; status: "approved" | "rejected"; }): Promise<{ message: string }>;
}