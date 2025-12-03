export const MATCH_ROUTES = {
    GET_MATCH: (matchId: string) => `/manager/tournament/matches/${matchId}/details`,
    SAVE_MATCH: (matchId: string) => `/manager/tournament/matches/${matchId}/save`,
} as const;