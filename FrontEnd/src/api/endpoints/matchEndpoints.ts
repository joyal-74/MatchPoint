import { MATCH_ROUTES } from "../../constants/routes/matchRoutes";
import type { LiveScoreState, Match, Team } from "../../features/manager/Matches/matchTypes";
import axiosClient from "../http/axiosClient";

interface MatchResponse {
    match: Match,
    teamA: Team,
    teamB: Team
}

export const matchEndpoints = {
    getMatchById: async (matchId: string): Promise<MatchResponse> => {
        const { data } = await axiosClient.get(MATCH_ROUTES.GET_MATCH(matchId));
        console.log(data.data, 'llll-llll')
        return data.data;
    },

    loadInitialLiveScore: async (matchId: string): Promise<LiveScoreState> => {
        const { data } = await axiosClient.get(MATCH_ROUTES.GET_LIVE_SCORE(matchId));
        console.log(data.data, 'jjjjjjjjjjjjjjjjjjjjjj')
        return data.data;
    },

    saveMatchData: async ({ matchId, tossWinnerId, tossDecision }: { matchId: string, tossWinnerId: string, tossDecision: string }): Promise<Match> => {
        const { data } = await axiosClient.post(MATCH_ROUTES.SAVE_MATCH(matchId), { tossWinnerId, tossDecision });
        return data.data;
    }
};