import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { LeaderboardController } from "presentation/http/controllers/shared/LeaderboardController";
import { container } from "tsyringe";

const router = Router();

const leaderboardController = container.resolve(LeaderboardController)

router.get("/stats", expressAdapter(leaderboardController.fetchLeaderboard));

export default router;