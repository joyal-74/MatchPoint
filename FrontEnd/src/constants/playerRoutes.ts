export const PLAYER_ROUTES = {
    GET_TEAMS: `/player/teams`,
    JOIN_TEAM: (teamId: string) => `/player/${teamId}/join`,
} as const;