import { MANAGER_ROUTES } from "../../constants/managerRoutes";
import type { Team, Tournament, TournamentRegister } from "../../features/manager/managerTypes";
import axiosClient from "../http/axiosClient";

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

    createTournament: async (createData: TournamentRegister): Promise<Tournament> => {
        const { data } = await axiosClient.post(MANAGER_ROUTES.CREATE_TOURNAMENT, createData)
        return data.data
    },

    getMyTournaments: async (managerId: string): Promise<Tournament[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_MY_TOURNAMENTS(managerId))
        return data.data
    },

    getExploreTournaments: async (managerId: string): Promise<Tournament[]> => {
        const { data } = await axiosClient.get(MANAGER_ROUTES.GET_EXPLORE_TOURNAMENTS(managerId))
        return data.data
    },

    cancelTournament: async ({ cancelId, reason }: { cancelId: string, reason: string }): Promise<string> => {
        const { data } = await axiosClient.patch(MANAGER_ROUTES.CANCEL_TOURNAMENT(cancelId), reason)
        return data.data
    },

    editTournament: async (updatedData: Tournament): Promise<Tournament> => {
        const { data } = await axiosClient.put(MANAGER_ROUTES.EDIT_TOURNAMENT(updatedData._id), updatedData)
        return data.data
    },
}