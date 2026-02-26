import { Router } from "express";

import { container } from "tsyringe";
import { LeaderboardController } from "../../http/controllers/shared/LeaderboardController";
import { expressAdapter } from "../../adaptors/ExpressAdaptor";

const router = Router();

const leaderboardController = container.resolve(LeaderboardController)

router.get("/stats", expressAdapter(leaderboardController.fetchLeaderboard));

export default router;
