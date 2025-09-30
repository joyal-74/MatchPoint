import { TeamData, TeamRegister } from "domain/dtos/Team.dto";
import { File } from "domain/entities/File";

export interface IGetAllTeamsUseCase {
    execute(managerId: string): Promise<TeamData[]>;
}

export interface IAddTeamUseCase {
    execute(teamData: TeamRegister, file : File): Promise<TeamData>;
}

export interface IChangePlayerStatusUseCase {
    execute(teamId: string, playerId: string): Promise<TeamData>;
}