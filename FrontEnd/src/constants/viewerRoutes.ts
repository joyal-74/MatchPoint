export const VIEWER_ROUTES = {
    GET_DETAILS: (viewerId: string) => `/viewer/${viewerId}`,
    EDIT_DETAILS: (viewerId: string) => `/viewer/${viewerId}`,
} as const;