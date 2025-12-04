import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { matchController } from "presentation/composition/manager/matches";

const router = Router();

// Initialize innings
router.post("/init-innings", expressAdapter(matchController.initInnings));

// Striker / Non-Striker
router.post("/set-striker", expressAdapter(matchController.setStriker));
router.post("/set-non-striker", expressAdapter(matchController.setNonStriker));

// Bowler
router.post("/set-bowler", expressAdapter(matchController.setBowler));

// Runs
router.post("/add-runs", expressAdapter(matchController.addRuns));

// Wicket
router.post("/add-wicket", expressAdapter(matchController.addWicket));

export default router;
