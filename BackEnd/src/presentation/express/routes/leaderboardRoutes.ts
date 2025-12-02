import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { leaderboardController } from "presentation/composition/shared/leaderboard";

const router = Router();

router.get("/stats", expressAdapter(leaderboardController.fetchLeaderboard));

export default router;