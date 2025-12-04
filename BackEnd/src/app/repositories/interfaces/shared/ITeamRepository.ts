import { PlayerDetails } from "app/usecases/admin/GetPlayerDetails";
import { Filters, PlayerApprovalStatus, playerStatus, TeamData, TeamDataFull, TeamDataSummary, TeamRegister } from "domain/dtos/Team.dto";

export interface ITeamRepository {
    findByName(name: string): Promise<TeamData | null>;
    findById(id: string): Promise<TeamDataFull | null>;
    findAllWithFilters(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
    findAllWithUserId(userId: string, status: string): Promise<{ teams: TeamDataSummary[], totalTeams: number }>;
    findAll(managerId: string): Promise<TeamDataFull[]>;
    togglePlayerStatus(teamId: string, playerId: string): Promise<TeamDataFull | null>;
    playerTeamStatus(teamId: string, playerId: string, status: PlayerApprovalStatus): Promise<TeamDataFull | null>;
    playerPlayingStatus(teamId: string, playerId: string, status: playerStatus): Promise<TeamDataFull | null>;
    create(teamData: TeamRegister): Promise<TeamDataFull>;
    addMember(teamId: string, userId: string, playerId: string): Promise<TeamData>;
    update(teamId: string, updates: Partial<TeamRegister>): Promise<TeamData>;
    removePlayer(teamId: string, playerId: string): Promise<TeamDataFull | null>;
    findTeamsByIds(teamIds: string[]);
    existOrAddMember(teamId: string, userId: string, playerId: string): Promise<PlayerDetails | null>;
}