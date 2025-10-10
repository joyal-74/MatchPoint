import type { Team } from "../../components/manager/teams/Types";
import type { RegisteredTeam } from "../../components/manager/tournaments/TournamentDetails/tabs/TabContent";
import type { TournamentFormData, updateTournamentFormData } from "../../components/manager/tournaments/TournamentModal/types";
import type { PaymentInitiateResponse } from "../../components/manager/tournaments/Types";
import { MANAGER_ROUTES } from "../../constants/managerRoutes";
import type { Tournament, TournamentRegister, TournamentUpdate } from "../../features/manager/managerTypes";
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
            userData, {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return data.data;
    },

    getAllTeams: async (managerId: string): Promise<Team[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_TEAMS(managerId));
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

    createTournament: async ({ formData, managerId }: { formData: TournamentFormData, managerId: string }): Promise<Tournament> => {
        const tournamentPayload: TournamentRegister = TournamentMapper.fromFormData(formData, managerId);
        const { data } = await axiosClient.post(MANAGER_ROUTES.CREATE_TOURNAMENT, tournamentPayload);
        return TournamentMapper.toTournamentResponse(data.data);
    },

    cancelTournament: async ({ cancelId, reason }: { cancelId: string, reason: string }): Promise<string> => {
        const { data } = await axiosClient.patch(MANAGER_ROUTES.CANCEL_TOURNAMENT(cancelId), reason)
        return data.data;
    },

    editTournament: async ({ formData, managerId }: { formData: updateTournamentFormData; managerId: string }): Promise<Tournament> => {
        const tournamentPayload: TournamentUpdate = TournamentMapper.fromEditingData(formData, managerId);

        const { data } = await axiosClient.put(MANAGER_ROUTES.EDIT_TOURNAMENT(formData._id!), tournamentPayload);
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
        console.log(data.data)
        return data.data;
    },

    verifyTournamentPayment: async ({ registrationId, paymentId, paymentStatus }: { registrationId: string, paymentId: string, paymentStatus: string }): Promise<boolean> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.PAYMENT_STATUS(registrationId), { paymentId, paymentStatus });
        return data.data;
    },

    getRegisteredTeams: async (tournamentId: string): Promise<RegisteredTeam[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.REGISTERED_TEAMS(tournamentId));
        return data.data;
    }
}