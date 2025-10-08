import { TeamData, TeamDataFull, TeamRegister } from "domain/dtos/Team.dto";
import { File } from "domain/entities/File";

export interface IGetAllTeamsUseCase {
    execute(managerId: string): Promise<TeamDataFull[]>;
}

export interface IAddTeamUseCase {
    execute(teamData: TeamRegister, file : File): Promise<TeamData>;
}

export interface IEditTeamUseCase {
    execute(teamData: TeamRegister, teamId : string, file : File): Promise<TeamData>;
}

export interface IChangeTeamStatusUseCase {
    execute(teamId : string): Promise<string>;
}

export interface IChangePlayerStatusUseCase {
    execute(teamId: string, playerId: string): Promise<TeamData>;
}