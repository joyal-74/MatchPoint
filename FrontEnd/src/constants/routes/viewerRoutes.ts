import { API_PREFIX } from "../../utils/api";

export const VIEWER_ROUTES = {
    GET_DETAILS: (viewerId: string) => `${API_PREFIX}/viewer/${viewerId}`,
    EDIT_DETAILS: (viewerId: string) => `${API_PREFIX}/viewer/${viewerId}`,
} as const;