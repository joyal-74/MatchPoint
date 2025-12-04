import { API_PREFIX } from "../../utils/api";

export const LEADERBOARD_ROUTES = {
    GET_DETAILS: `${API_PREFIX}/leaderboard/stats`,
} as const;