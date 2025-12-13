import { API_PREFIX } from "../../utils/api";

export const VIEWER_ROUTES = {
    GET_DETAILS: (viewerId: string) => `${API_PREFIX}/viewer/${viewerId}`,
    EDIT_DETAILS: (viewerId: string) => `${API_PREFIX}/viewer/${viewerId}`,
    GET_LIVE_MATCHES: (viewerId: string) => `${API_PREFIX}/viewer/${viewerId}/matches/live`,
    FETCH_MATCH_UPDATES: (matchId: string) => `${API_PREFIX}/viewer/${matchId}/live/updates`,
} as const;