import { Router } from "express";
import { MatchController } from "../../http/controllers/manager/MatchController";
import { container } from "tsyringe";
import { expressAdapter } from "../../adaptors/ExpressAdaptor";
import { managerOnly, umpireOnly } from "../middlewares/index";


const router = Router();

const matchController = container.resolve(MatchController)

router.get("/:matchId", umpireOnly, expressAdapter(matchController.getMatchDetails));

router.get("/live/:matchId", umpireOnly, expressAdapter(matchController.getLiveScore));

router.patch("/:matchId/save", managerOnly, expressAdapter(matchController.saveMatchData));

router.post("/start", umpireOnly, expressAdapter(matchController.startMatchData));

router.patch("/:matchId/end", umpireOnly, expressAdapter(matchController.saveMatchData));

router.post("/init-innings", umpireOnly, expressAdapter(matchController.initInnings));

router.post("/set-striker", umpireOnly, expressAdapter(matchController.setStriker));
router.post("/set-non-striker", umpireOnly, expressAdapter(matchController.setNonStriker));
router.post("/set-bowler", umpireOnly, expressAdapter(matchController.setBowler));


router.post("/add-runs", umpireOnly, expressAdapter(matchController.addRuns));
router.post("/add-wicket", umpireOnly, expressAdapter(matchController.addWicket));
router.post("/add-extras", umpireOnly, expressAdapter(matchController.addExtras));

router.post("/add-penalty", umpireOnly, expressAdapter(matchController.addPenalty));
router.post("/retire-batsman", umpireOnly, expressAdapter(matchController.retireBatsman));
router.post("/end-over", umpireOnly, expressAdapter(matchController.endOver));
router.post("/end-innings", umpireOnly, expressAdapter(matchController.endInnings));

router.patch("/:matchId/undo-ball", umpireOnly, expressAdapter(matchController.undoLastBall));

router.patch("/:matchId/super-over", umpireOnly, expressAdapter(matchController.startSuperOver));

export default router;
