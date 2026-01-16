import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { container } from "tsyringe";
import { MatchController } from "presentation/http/controllers/manager/MatchController";


const router = Router();

const matchController = container.resolve(MatchController)

router.get("/:matchId", expressAdapter(matchController.getMatchDetails));

router.get("/live/:matchId", expressAdapter(matchController.getLiveScore));

router.patch("/:matchId/save", expressAdapter(matchController.saveMatchData));

router.post("/start", expressAdapter(matchController.startMatchData));

router.patch("/:matchId/end", expressAdapter(matchController.saveMatchData));

router.post("/init-innings", expressAdapter(matchController.initInnings));

router.post("/set-striker", expressAdapter(matchController.setStriker));
router.post("/set-non-striker", expressAdapter(matchController.setNonStriker));
router.post("/set-bowler", expressAdapter(matchController.setBowler));


router.post("/add-runs", expressAdapter(matchController.addRuns));
router.post("/add-wicket", expressAdapter(matchController.addWicket));
router.post("/add-extras", expressAdapter(matchController.addExtras));

router.post("/add-penalty", expressAdapter(matchController.addPenalty));
router.post("/retire-batsman", expressAdapter(matchController.retireBatsman));
router.post("/end-over", expressAdapter(matchController.endOver));
router.post("/end-innings", expressAdapter(matchController.endInnings));

router.patch("/:matchId/undo-ball", expressAdapter(matchController.undoLastBall));

router.patch("/:matchId/super-over", expressAdapter(matchController.startSuperOver));

export default router;