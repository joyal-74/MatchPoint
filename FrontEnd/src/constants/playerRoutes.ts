export const PLAYER_ROUTES = {
    GET_DETAILS: (playerId: string) => `/player/${playerId}`,
    EDIT_DETAILS: (playerId: string) => `/player/${playerId}`,
    GET_TEAMS: `/player/teams`,
    GET_MY_TEAMS: (playerId: string) => `/player/teams/${playerId}`,
    GET_MY_TEAM: (teamId: string) => `/player/teams/${teamId}/details`,
    JOIN_TEAM: (teamId: string) => `/player/${teamId}/join`,
} as const;