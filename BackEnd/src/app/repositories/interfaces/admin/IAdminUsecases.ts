import { ManagerResponseDTO } from "../../../../domain/dtos/Manager.dto.js";
import { PlayerResponseDTO } from "../../../../domain/dtos/Player.dto.js";
import { TeamDataFull, TeamDataSummary, TeamStatus } from "../../../../domain/dtos/Team.dto.js";
import { UserResponseDTO } from "../../../../domain/dtos/User.dto.js";
import { Plan } from "../../../../domain/entities/Plan.js";
import { Tournament } from "../../../../domain/entities/Tournaments.js";
import { Transaction } from "../../../../domain/entities/Transaction.js";
import { GetAllUsersParams } from "../../../usecases/admin/GetAllViewers.js";
import { ManagerDetails } from "../../../usecases/admin/GetManagerDetails.js";
import { PlayerDetails } from "../../../usecases/admin/GetPlayerDetails.js";
import { ViewerDetails } from "../../../usecases/admin/GetViewerDetails.js";


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

export interface IChangeTournamentStatus {
    execute(tourId: string, status: boolean, params: AdminTableParams): Promise<{tournaments : Tournament[], totalCount : number}>;
}
export interface IChangeTournamentDetailStatus {
    execute(teamId: string, status: boolean ): Promise<Tournament>;
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

export interface IGetTournamentDetails {
    execute(id: string): Promise<Tournament>;
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

export interface IGetAdminTransactions {
    execute(params: GetAllUsersParams): Promise<{ data: Transaction[], total: number }>
}

export interface IGetTransactionDetails {
    execute(id: string): Promise<Transaction | null>;
}

export interface IGetDashboardStatsUseCase {
    execute()
}
