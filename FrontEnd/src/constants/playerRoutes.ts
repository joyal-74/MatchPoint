export const PLAYER_ROUTES = {
    GET_DETAILS: (playerId: string) => `/player/${playerId}/profile`,
    EDIT_DETAILS: (playerId: string) => `/player/${playerId}/profile`,
    EDIT_PROFILE_DETAILS: (playerId: string) => `/player/${playerId}/profile/sports`,
    GET_TEAMS: `/player/teams`,
    GET_MY_TEAMS: (playerId: string, status: string) => `/player/teams/${playerId}/${status}`,
    GET_MY_All_TEAMS: (playerId: string) => `/player/teams/${playerId}`,
    GET_MY_TEAM: (teamId: string) => `/player/team/${teamId}/details`,
    JOIN_TEAM: (teamId: string) => `/player/${teamId}/join`,
    GET_TOURNAMENTS: `/player/tournaments`,
    GET_MY_TOURNAMENTS: (playerId: string) => `/player/tournaments/${playerId}`,
} as const;