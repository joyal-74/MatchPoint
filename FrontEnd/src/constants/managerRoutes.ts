export const MANAGER_ROUTES = {
    GET_TEAMS: (managerId: string) => `/manager/teams/${managerId}`,
    CREATE_TEAM: '/manager/team',
    DELETE_TEAM: '/manager/team',
    EDIT_TEAM: (teamId: string) =>  `/manager/team/${teamId}`,
} as const;