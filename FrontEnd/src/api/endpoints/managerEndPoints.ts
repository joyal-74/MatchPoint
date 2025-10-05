import type { TournamentFormData, updateTournamentFormData } from "../../components/manager/tournaments/TournamentModal/types";
import { MANAGER_ROUTES } from "../../constants/managerRoutes";
import type { Team, Tournament, TournamentRegister, TournamentUpdate } from "../../features/manager/managerTypes";
import axiosClient from "../http/axiosClient";
import { TournamentMapper } from "../mappers/TournamentMapper";

export const managerEndpoints = {
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

    getExploreTournaments: async ({ managerId, page, limit, search, filter }: { managerId: string, page: number, limit: number, search: string, filter: string }): Promise<Tournament[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_EXPLORE_TOURNAMENTS(managerId), { params: { managerId, page, limit, search, filter } })
        return TournamentMapper.toTournamentResponseArray(data.data);
    },
}