import { PLAYER_ROUTES } from "../../constants/routes/playerRoutes";
import axiosClient from "../http/axiosClient";
import type { Filters, Team, totalTeamResponse } from "../../components/player/Teams/Types";
import type { UpdatePlayerProfilePayload, UpdateUserDataPayload } from "../../features/manager/managerTypes";
import type { Player } from "../../types/Player";

export const playerEndpoints = {

    fetchPlayerData: async (playerId: string): Promise<Player> => {
        const { data } = await axiosClient.get(PLAYER_ROUTES.GET_DETAILS(playerId));
        return data.data;
    },

    updatePlayerData: async ({ userData, userId }: UpdateUserDataPayload): Promise<Player> => {
        const { data } = await axiosClient.put(PLAYER_ROUTES.EDIT_DETAILS(userId),
            userData, { headers: { "Content-Type": "multipart/form-data" }, }
        );
        return data.data;
    },

    updatePlayerProfileData: async ({ userData, userId }: UpdatePlayerProfilePayload): Promise<Player> => {
        const { data } = await axiosClient.put(PLAYER_ROUTES.EDIT_PROFILE_DETAILS(userId), userData);
        return data.data;
    },

    getAllTeams: async (filters: Filters): Promise<{ teams: Team[], totalTeams: number }> => {
        const { data } = await axiosClient.get(PLAYER_ROUTES.GET_TEAMS, {
            params: filters,
        });
        return data.data;
    },

    joinTeam: async ({ playerId, teamId }: { playerId: string, teamId: string }): Promise<Team> => {
        const { data } = await axiosClient.post(PLAYER_ROUTES.JOIN_TEAM(teamId), { playerId, teamId })
        return data.data;
    },


    getMyAllTeams: async (playerId: string): Promise<totalTeamResponse> => {
        const { data } = await axiosClient.get(PLAYER_ROUTES.GET_MY_All_TEAMS(playerId))
        console.log(data.data)
        return data.data;
    },

    getMyTeamDetails: async (teamId: string): Promise<Team> => {
        const { data } = await axiosClient.get(PLAYER_ROUTES.GET_MY_TEAM(teamId))
        console.log(data.data)
        return data.data;
    },

    teamInviteReponse: async ({ playerId, teamId, status }: { playerId: string, teamId: string, status: string }): Promise<string> => {
        const { data } = await axiosClient.post(PLAYER_ROUTES.SET_PLAYER_STATUS(playerId), { teamId, status })
        console.log(data.data)
        return data.data;
    },

    fetchTournaments: async (filters?: { status?: string; page?: number; limit?: number; playerId?: string }) => {
        const { status, page = 1, limit = 10, playerId } = filters || {};
        const { data } = await axiosClient.get(PLAYER_ROUTES.GET_TOURNAMENTS, {
            params: { status, page, limit, playerId }
        });

        return data.data;
    },

    tournamentDetails: async (tournamentId: string) => {
        const { data } = await axiosClient.post(PLAYER_ROUTES.GET_TOURNAMENT_DETAILS, { tournamentId })

        return data.data;
    },

    fetchLiveMatches: async (filters?: { status?: string; page?: number; limit?: number; }) => {
        const { status, page = 1, limit = 10 } = filters || {};
        const { data } = await axiosClient.get(PLAYER_ROUTES.GET_MATCHES, {
            params: { status, page, limit }
        });

        console.log(data.data)

        return data.data;
    },

    fetchTournamentMatches: async (tournamentId: string) => {
        const { data } = await axiosClient.post(PLAYER_ROUTES.GET_TOURNAMENT_MATCHES, { tournamentId });

        return data.data;
    },

    fetchTournamentPointsTable: async (tournamentId: string) => {
        const { data } = await axiosClient.post(PLAYER_ROUTES.GET_TOURNAMENT_TABLE, { tournamentId });

        return data.data;
    },

    fetchTournamentStats: async (tournamentId: string) => {
        const { data } = await axiosClient.post(PLAYER_ROUTES.GET_TOURNAMENT_STATS, { tournamentId });

        return data.data;
    },
};