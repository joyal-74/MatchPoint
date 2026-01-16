import { API_PREFIX } from "../../utils/api";

export const PLAYER_ROUTES = {
    GET_DETAILS: (playerId: string) => `${API_PREFIX}/player/${playerId}/profile`,
    EDIT_DETAILS: (playerId: string) => `${API_PREFIX}/player/${playerId}/profile`,
    EDIT_PROFILE_DETAILS: (playerId: string) => `${API_PREFIX}/player/${playerId}/profile/sports`,
    GET_TEAMS: `/player/teams`,
    GET_MY_TEAMS: (playerId: string, status: string) => `${API_PREFIX}/player/teams/${playerId}/${status}`,
    GET_MY_All_TEAMS: (playerId: string) => `${API_PREFIX}/player/teams/${playerId}`,
    GET_MY_TEAM: (teamId: string) => `${API_PREFIX}/player/team/${teamId}/details`,
    JOIN_TEAM: (teamId: string) => `${API_PREFIX}/player/${teamId}/join`,
    GET_TOURNAMENTS: `${API_PREFIX}/player/tournaments`,
    GET_TOURNAMENT_MATCHES: `${API_PREFIX}/player/tournaments/details/matches`,
    GET_TOURNAMENT_TABLE: `${API_PREFIX}/player/tournaments/details/pointstable`,
    GET_TOURNAMENT_STATS: `${API_PREFIX}/player/tournaments/details/stats`,
    GET_TOURNAMENT_DETAILS: `${API_PREFIX}/player/tournaments/details`,
    GET_MATCHES: `${API_PREFIX}/player/tournament/matches`,
    GET_MY_TOURNAMENTS: (playerId: string) => `${API_PREFIX}/player/tournaments/${playerId}`,
    SET_PLAYER_STATUS: (playerId: string) => `${API_PREFIX}/player/team/${playerId}/invite/status`,
} as const;