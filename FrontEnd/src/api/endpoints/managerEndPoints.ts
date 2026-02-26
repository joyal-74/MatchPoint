import type { Team } from "../../components/manager/teams/Types";
import type { RegisteredTeam } from "../../components/manager/tournaments/TournamentDetails/tabs/TabContent";
import type { PaymentInitiateResponse, TeamResultSummary } from "../../components/manager/tournaments/Types";
import { MANAGER_ROUTES } from "../../constants/routes/managerRoutes";
import type { TournamentFinancials, Transaction } from "../../features/shared/wallet/walletSlice";
import type { Fixture, Leaderboard, Match, Tournament } from "../../features/manager/managerTypes";
import type { AnalyticsData, PointsTableData } from "../../features/manager/Tournaments/tournamentTypes";
import type { UmpireData } from "../../features/umpire/umpireTypes";
import type { TeamPlayer } from "../../types/Player";
import type { User } from "../../types/User";
import axiosClient from "../http/axiosClient";
import { TournamentMapper } from "../mappers/TournamentMapper";

export const managerEndpoints = {
    fetchManagerData: async (managerId: string): Promise<User> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_DETAILS(managerId));
        return data.data;
    },

    updateManagerData: async ({ userData, userId }: { userData: FormData; userId: string }): Promise<User> => {
        const { data } = await axiosClient.put(MANAGER_ROUTES.EDIT_DETAILS(userId),
            userData);

        return data.data;
    },

    getAllTeams: async (managerId: string): Promise<Team[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_TEAMS(managerId));
        console.log(data.data)
        return data.data;
    },

    getMyTeamDetails: async (teamId: string): Promise<Team> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_TEAM(teamId));
        return data.data;
    },

    createTeam: async (updatedData: FormData): Promise<Team> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.CREATE_TEAM, updatedData);
        return data.data
    },

    deleteTeam: async (teamId: string): Promise<string> => {
        const { data } = await axiosClient.patch(MANAGER_ROUTES.DELETE_TEAM(teamId));
        return data.data;
    },

    editTeam: async ({ teamId, updatedData }: { teamId: string; updatedData: FormData }): Promise<Team> => {
        const { data } = await axiosClient.put(MANAGER_ROUTES.EDIT_TEAM(teamId), updatedData);
        return data.data;
    },

    createTournament: async (formData: FormData): Promise<Tournament> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.CREATE_TOURNAMENT, formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return TournamentMapper.toTournamentResponse(data.data);
    },

    cancelTournament: async ({ cancelId, reason }: { cancelId: string, reason: string }): Promise<string> => {
        const { data } = await axiosClient.patch(MANAGER_ROUTES.CANCEL_TOURNAMENT(cancelId), reason)
        return data.data;
    },

    editTournament: async ({ formData, tourId }: { formData: FormData, tourId: string }): Promise<Tournament> => {
        const { data } = await axiosClient.put(MANAGER_ROUTES.EDIT_TOURNAMENT(tourId), formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return TournamentMapper.toTournamentResponse(data.data);
    },


    getMyTournaments: async (managerId: string): Promise<Tournament[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_MY_TOURNAMENTS(managerId))
        console.log(data.data)
        return TournamentMapper.toTournamentResponseArray(data.data);
    },

    fetchTournamentDetails: async (tourId: string): Promise<Tournament> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.TOURNAMENT_DETAILS(tourId))
        return TournamentMapper.toTournamentResponse(data.data);
    },

    getExploreTournaments: async ({ managerId, page, limit, search, filter }: { managerId: string, page: number, limit: number, search: string, filter: string })
        : Promise<Tournament[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_EXPLORE_TOURNAMENTS(managerId), { params: { managerId, page, limit, search, filter } })
        return TournamentMapper.toTournamentResponseArray(data.data);
    },

    paymentInitiate: async ({ tournamentId, teamId, captainId, managerId, paymentMethod }: { tournamentId: string; teamId: string; captainId: string; managerId: string, paymentMethod: 'razorpay' | 'wallet' })
        : Promise<PaymentInitiateResponse> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.TOUTNAMENT_PAYMENT(tournamentId), { teamId, captainId, managerId, paymentMethod });
        return data.data;
    },

    verifyTournamentPayment: async ({ managerId, registrationId, paymentId, paymentStatus }: { managerId: string, registrationId: string, paymentId: string, paymentStatus: string }): Promise<boolean> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.PAYMENT_STATUS(registrationId), { paymentId, paymentStatus, managerId });
        return data.data;
    },

    getRegisteredTeams: async (tournamentId: string): Promise<RegisteredTeam[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.REGISTERED_TEAMS(tournamentId));
        return data.data;
    },

    rejectPlayerRequest: async ({ teamId, playerId }: { teamId: string; playerId: string }): Promise<RegisteredTeam[]> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.REJECT_PLAYER(playerId), { teamId, playerId });
        return data.data;
    },

    removePlayerFromTeam: async ({ teamId, playerId }: { teamId: string; playerId: string }): Promise<RegisteredTeam[]> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.REMOVE_PLAYER(playerId), { teamId, playerId });
        return data.data;
    },

    approvePlayerRequest: async ({ teamId, playerId }: { teamId: string; playerId: string }): Promise<RegisteredTeam[]> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.APPROVE_PLAYER(playerId), { teamId, playerId });
        return data.data;
    },

    updatePlayerStatus: async ({ teamId, playerId, status }: { teamId: string; playerId: string, status: string }): Promise<void> => {
        const { data } = await axiosClient.patch(MANAGER_ROUTES.UPDATE_PLAYER(playerId), { teamId, playerId, status });
        return data.data;
    },

    createTournamentMatches: async ({ tournamentId, matchesData }: { tournamentId: string, matchesData: Match[] }): Promise<Match[]> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.CREATE_MATCHES(tournamentId), { matchesData });
        return data.data
    },

    createTournamentFixtures: async ({ tournamentId, matchIds, format }: { tournamentId: string, matchIds: { matchId?: string; round: number }[], format: string }): Promise<Fixture[]> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.CREATE_FIXTURE(tournamentId), { matchIds, format });
        return data.data
    },

    getTournamentFixtures: async (tournamentId: string): Promise<Fixture> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_FIXTURES(tournamentId));
        return data.data
    },

    getTournamentMatches: async (tournamentId: string): Promise<Match[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_MATCHES(tournamentId));
        return data.data
    },

    fetchLeaderboard: async (tournamentId: string): Promise<Leaderboard> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_LEADERBOARD(tournamentId));
        return data.data
    },

    fetchPayments: async (managerId: string): Promise<{ balance: number, transactions: Transaction[], tournaments: TournamentFinancials[] }> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_PAYMENTS(managerId));
        return data.data
    },

    getAvailablePlayers: async (teamId: string): Promise<TeamPlayer[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_AVAILABLE_PLAYERS(teamId));
        return data.data
    },

    addPlayerToTeam: async ({ teamId, userId, playerId }: { teamId: string, userId: string, playerId: string }): Promise<{ message: string }> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.ADD_PLAYER(playerId), { teamId, userId });
        return data.data;
    },

    startTournament: async (tournamentId: string): Promise<{ message: string }> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.START_TOURNAMENT, { tournamentId });
        return data.data;
    },

    getDashboardAnalytics: async (managerId: string): Promise<AnalyticsData> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_DASHBOARD_ANALYTICS(managerId));
        return data.data;
    },

    fetchTournamentPointsTable: async (tournamentId: string): Promise<PointsTableData> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_POINTS_TABLE(tournamentId));
        return data.data;
    },

    getTournamentMatchesResult: async (tournamentId: string): Promise<TeamResultSummary[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_MATCH_RESULT(tournamentId));
        return data.data;
    },

    searchAvailableUmpires: async (): Promise<UmpireData[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.AVAILABLE_UMPIRES);
        return data.data;
    },
}