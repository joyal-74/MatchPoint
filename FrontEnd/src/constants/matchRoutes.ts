export const MATCH_ROUTES = {
    GET_MATCH: (matchId: string) => `/manager/tournament/matches/${matchId}/details`,
    GET_LIVE_SCORE: (matchId: string) => `/manager/tournament/matches/${matchId}/livescore`,
    SAVE_MATCH: (matchId: string) => `/manager/tournament/matches/${matchId}/save`,
} as const;