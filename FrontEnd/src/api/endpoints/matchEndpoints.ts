import { MATCH_ROUTES } from "../../constants/routes/matchRoutes";
import type { Match, Team } from "../../domain/match/types";
import type { LiveScoreState } from "../../features/manager/Matches/matchTypes";
import axiosClient from "../http/axiosClient";

interface MatchResponse {
    match: Match,
    teamA: Team,
    teamB: Team
}

export const matchEndpoints = {
    getMatchById: async (matchId: string): Promise<MatchResponse> => {
        const { data } = await axiosClient.get(MATCH_ROUTES.GET_MATCH(matchId));
        return data.data;
    },

    loadInitialLiveScore: async (matchId: string): Promise<LiveScoreState> => {
        const { data } = await axiosClient.get(MATCH_ROUTES.GET_LIVE_SCORE(matchId));
        return data.data;
    },

    saveMatchData: async ({ matchId, tossWinnerId, tossDecision }: { matchId: string, tossWinnerId: string, tossDecision: string }): Promise<Match> => {
        const { data } = await axiosClient.post(MATCH_ROUTES.SAVE_MATCH(matchId), { tossWinnerId, tossDecision });
        return data.data;
    },

    startMatch: async (matchId: string): Promise<Match> => {
        const { data } = await axiosClient.post(MATCH_ROUTES.START_MATCH, { matchId });
        return data.data;
    },

    fetchMatchesByManager: async (managerId: string): Promise<Match> => {
        const { data } = await axiosClient.get(MATCH_ROUTES.GET_MATCHES(managerId));
        return data.data;
    },

    fetchAllMatches: async (filters?: { status?: string; search?: string, page?: number; limit?: number; }): Promise<{ matches: Match[], totalPages: number }> => {
        const { status, page = 1, limit = 10, search } = filters || {};
        const { data } = await axiosClient.get(MATCH_ROUTES.GET_All_MATCHES, {
            params: { status, page, search, limit }
        });
        return data.data;
    },
};