import { TeamData, TeamDataFull, TeamDataSummary, TeamRegister } from "../../../../domain/dtos/Team.dto";
import { Chat } from "../../../../domain/entities/Chat";
import { File } from "../../../../domain/entities/File";

export interface IGetAllTeamsUseCase {
    execute(managerId: string): Promise<TeamDataFull[]>;
}

export interface IAddTeamUseCase {
    execute(teamData: TeamRegister, file: File): Promise<TeamData>;
}

export interface IEditTeamUseCase {
    execute(teamData: TeamRegister, teamId: string, file: File): Promise<TeamData>;
}

export interface IChangeTeamStatusUseCase {
    execute(teamId: string): Promise<string>;
}

export interface IGetUserTeamsUseCase {
    execute(userId: string, role: string): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
}

export interface IChangePlayerStatusUseCase {
    execute(teamId: string, playerId: string): Promise<TeamDataFull>;
}

export interface IApprovePlayerUseCase {
    execute(teamId: string, playerId: string): Promise<TeamDataFull>;
}

export interface ISwapPlayers {
    execute(teamId: string, playerId: string, status: string): Promise<void>;
}

export interface IRejectPlayerUseCase {
    execute(teamId: string, playerId: string): Promise<TeamDataFull>;
}

export interface IRemovePlayerUseCase {
    execute(teamId: string, playerId: string): Promise<TeamDataFull>;
}

export interface IAddPlayerToTeamUseCase {
    execute(teamId: string, userId: string, playerId: string): Promise<{ success: boolean; message: string }>;
}

export interface ICreateChatForTeamUseCase {
    execute(teamId: string): Promise<Chat>;
}
