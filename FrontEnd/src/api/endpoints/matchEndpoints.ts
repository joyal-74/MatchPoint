import { MATCH_ROUTES } from "../../constants/matchRoutes";
import type { Match, Team } from "../../features/manager/Matches/matchTypes";
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

    saveMatchData: async ({ matchId, tossWinnerId, tossDecision }: { matchId: string, tossWinnerId: string, tossDecision: string }): Promise<Match> => {
        const { data } = await axiosClient.post(MATCH_ROUTES.SAVE_MATCH(matchId), { tossWinnerId, tossDecision });
        console.log(data.data)
        return data.data;
    }
};