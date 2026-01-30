import { API_PREFIX } from "../../utils/api";

export const MATCH_ROUTES = {
    GET_MATCH: (matchId: string) => `${API_PREFIX}/manager/tournament/matches/${matchId}/details`,
    GET_LIVE_SCORE: (matchId: string) => `${API_PREFIX}/manager/tournament/matches/${matchId}/livescore`,
    SAVE_MATCH: (matchId: string) => `${API_PREFIX}/manager/tournament/matches/${matchId}/save`,
    START_MATCH: `${API_PREFIX}/manager/tournament/matches/start`,
    GET_MATCHES: (managerId: string) => `${API_PREFIX}/manager/matches/${managerId}`,
    GET_All_MATCHES: `${API_PREFIX}/manager/matches`,
} as const;