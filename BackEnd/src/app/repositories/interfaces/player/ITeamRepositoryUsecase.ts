import { Filters, TeamData } from "domain/dtos/Team.dto";

export interface IGetAllTeamsUseCase {
    execute(filters: Filters): Promise<TeamData[]>;
}

export interface IJoinTeamUseCase {
    execute(playerId: string, teamId: string): Promise<TeamData>;
}