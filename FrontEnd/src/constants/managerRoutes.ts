export const MANAGER_ROUTES = {
    GET_TEAMS: (managerId: string) => `/manager/teams/${managerId}`,
    CREATE_TEAM: '/manager/team',
    DELETE_TEAM: (teamId: string) => `/manager/team/${teamId}`,
    EDIT_TEAM: (teamId: string) =>  `/manager/team/${teamId}`,
    CREATE_TOURNAMENT: '/manager/tournament',
    GET_MY_TOURNAMENTS:  (managerId: string) => `/manager/tournament/${managerId}`,
    GET_EXPLORE_TOURNAMENTS:  (managerId: string) => `/manager/tournament/explore/${managerId}`,
    CANCEL_TOURNAMENT:  (tournamentId: string) => `/manager/tournament/${tournamentId}`,
    EDIT_TOURNAMENT:  (tournamentId: string) => `/manager/tournament/${tournamentId}`,
} as const;