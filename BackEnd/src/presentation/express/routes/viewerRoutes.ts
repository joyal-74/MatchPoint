import { Router } from "express";
import multer from "multer";
import { container } from "tsyringe";
import { MatchesController } from "../../http/controllers/viewer/MatchesController.js";
import { ProfileController } from "../../http/controllers/manager/ProfileController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { expressFileUpdateHandler } from "../../adaptors/ExpressFileAdaptor.js";
import { TournamentController } from "../../http/controllers/viewer/TournamentController.js";

const router = Router();
const upload = multer();

const viewerMatchesController = container.resolve(MatchesController)
const viewerProfileController = container.resolve(ProfileController)
const viewerTournamentController = container.resolve(TournamentController)

router.get("/tournaments", expressAdapter(viewerTournamentController.getTournaments));
router.get('/:viewerId', expressAdapter(viewerProfileController.getProfile));
router.put("/:viewerId", upload.single("file"), expressFileUpdateHandler(viewerProfileController.updateProfile));
router.get("/:viewerId/matches/live", expressAdapter(viewerMatchesController.getLiveMatches));
router.get("/:matchId/live/updates", expressAdapter(viewerMatchesController.getLiveUpdates));

export default router;
