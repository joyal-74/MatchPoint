import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { ManagerDetails } from "app/usecases/admin/GetManagerDetails";
import { PlayerDetails } from "app/usecases/admin/GetPlayerDetails";
import { ViewerDetails } from "app/usecases/admin/GetViewerDetails";
import { ManagerResponseDTO } from "domain/dtos/Manager.dto";
import { PlayerResponseDTO } from "domain/dtos/Player.dto";
import { TeamDataFull, TeamDataSummary, TeamStatus } from "domain/dtos/Team.dto";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { Plan } from "domain/entities/Plan";
import { Tournament } from "domain/entities/Tournaments";

export interface AdminTableParams {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
}


export interface IGetUsersUsecase<TUser> {
    execute(params: GetAllUsersParams): Promise<{ users: TUser[], totalCount: number }>;
}

export type RoleResponseDTO = PlayerResponseDTO | UserResponseDTO | ManagerResponseDTO;

export interface IChangeUserStatus {
    execute(role: string, userId: string, isActive: boolean, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }>;
}

export interface IChangeTeamStatus {
    execute(teamId: string, isBlocked: TeamStatus, params: AdminTableParams): Promise<{ teams: TeamDataFull[], totalCount: number }>;
}
export interface IChangeTeamDetailStatus {
    execute(teamId: string, status: TeamStatus ): Promise<TeamDataFull>;
}

export interface IChangeUserBlockStatus {
    execute(userId: string, isActive: boolean): Promise<RoleResponseDTO>;
}

export interface IGetUsersByRole {
    execute(role: string, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }>
}

export type IGetViewersUsecase = IGetUsersUsecase<UserResponseDTO>;
export type IGetPlayersUsecase = IGetUsersUsecase<PlayerResponseDTO>;
export type IGetManagersUsecase = IGetUsersUsecase<ManagerResponseDTO>;

export interface IGetManagerDetails {
    execute(id: string): Promise<ManagerDetails>;
}

export interface IGetPlayerDetails {
    execute(id: string): Promise<PlayerDetails>;
}

export interface IGetTeamDetails {
    execute(id: string): Promise<TeamDataFull>;
}

export interface IGetViewerDetails {
    execute(id: string): Promise<ViewerDetails>;
}

export interface ICreatePlan {
    execute(planData: Plan): Promise<Plan>
}

export interface IUpdatePlan {
    execute(id: string, planData: Plan): Promise<Plan>
}

export interface IGetPlans {
    execute(): Promise<Plan[]>
}

export interface IDeletePlan {
    execute(id: string): Promise<boolean>
}

export interface IGetTeamsUsecase {
    execute(params: GetAllUsersParams): Promise<{ teams: TeamDataSummary[], totalCount: number }>
}

export interface IGetTournamentUsecase {
    execute(params: GetAllUsersParams): Promise<{ tournaments: Tournament[], total: number }>
}

export interface IGetDashboardStatsUseCase {
    execute()
}