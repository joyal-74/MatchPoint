import { API_PREFIX } from "../../utils/api";

export const MATCH_ROUTES = {
    GET_MATCH: (matchId: string) => `${API_PREFIX}/manager/tournament/matches/${matchId}/details`,
    GET_LIVE_SCORE: (matchId: string) => `${API_PREFIX}/manager/tournament/matches/${matchId}/livescore`,
    SAVE_MATCH: (matchId: string) => `${API_PREFIX}/manager/tournament/matches/${matchId}/save`,
    START_MATCH:  `${API_PREFIX}/manager/tournament/matches/start`,
} as const;