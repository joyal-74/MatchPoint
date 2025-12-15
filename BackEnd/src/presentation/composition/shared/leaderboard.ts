import { GetLeaderboard } from "app/usecases/shared/GetLeaderboard";
import { LeaderboardController } from "presentation/http/controllers/shared/LeaderboardController";
import { leaderboardRepository } from "./repositories";

const getLeaderboardUC = new GetLeaderboard(leaderboardRepository);

export const leaderboardController = new LeaderboardController(getLeaderboardUC);