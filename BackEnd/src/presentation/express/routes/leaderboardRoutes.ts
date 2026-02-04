import { Router } from "express";

import { container } from "tsyringe";
import { LeaderboardController } from "../../http/controllers/shared/LeaderboardController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";

const router = Router();

const leaderboardController = container.resolve(LeaderboardController)

router.get("/stats", expressAdapter(leaderboardController.fetchLeaderboard));

export default router;
