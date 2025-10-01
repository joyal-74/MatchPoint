export const MANAGER_ROUTES = {
    GET_TEAMS: (managerId: string) => `/manager/teams/${managerId}`,
    CREATE_TEAM: '/manager/team',
    DELETE_TEAM: (teamId: string) => `/manager/team/${teamId}`,
    EDIT_TEAM: (teamId: string) =>  `/manager/team/${teamId}`,
} as const;