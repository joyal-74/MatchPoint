import { PLAYER_ROUTES } from "../../constants/playerRoutes";
import type { Team } from "../../features/player/playerTypes";
import axiosClient from "../http/axiosClient";
import type { Filters } from "../../components/player/Teams/Types";

export const playerEndpoints = {
    getAllTeams: async (filters: Filters): Promise<Team[]> => {
        const { data } = await axiosClient.get(PLAYER_ROUTES.GET_TEAMS, {
            params: filters,
        });
        return data.data;
    },

    joinTeam: async ({ playerId, teamId }: { playerId: string, teamId: string }): Promise<Team> => {
        const { data } = await axiosClient.post(PLAYER_ROUTES.JOIN_TEAM(teamId), { playerId, teamId })
        return data.data;
    }
};