import { AdminFilters, Filters, PlayerApprovalStatus, playerStatus, TeamData, TeamDataFull, TeamDataSummary, TeamRegister } from "../../../../domain/dtos/Team.dto";
import { IBaseRepository } from "../../IBaseRepository";

export interface ITeamRepository extends IBaseRepository<TeamRegister, TeamDataFull> {

    findByName(name: string): Promise<TeamData | null>;
    findTeamsByIds(teamIds: string[]): Promise<TeamDataFull[]>;
    findTeamWithPlayers(teamIds: string[], playerIds: string[]): Promise<TeamData | null>;
    findAllByManager(managerId: string): Promise<TeamDataFull[]>;

    // Filtered Listings
    findAllWithFilters(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
    findAllWithUserId(userId: string, status: string): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
    findAllTeams(filters: AdminFilters): Promise<{ teams: TeamDataFull[], totalCount: number }>;
    findUserTeams(userId: string, role: string): Promise<{ teams: TeamDataFull[], totalTeams: number }>;

    // Domain Specific Logic
    togglePlayerStatus(teamId: string, playerId: string): Promise<TeamDataFull | null>;
    playerTeamStatus(teamId: string, playerId: string, status: PlayerApprovalStatus): Promise<TeamDataFull | null>;
    playerPlayingStatus(teamId: string, playerId: string, status: playerStatus): Promise<TeamDataFull | null>;
    addMember(teamId: string, userId: string, playerId: string): Promise<TeamData>;
    removePlayer(teamId: string, playerId: string): Promise<TeamDataFull | null>;
    leavePlayer(teamId: string, userId: string): Promise<boolean | null>;
    existOrAddMember(teamId: string, userId: string, playerId: string): Promise<{ success: boolean; playerId: string }>;
    updateInviteStatus(teamId: string, playerId: string, status: "approved" | "rejected"): Promise<boolean>;
}
