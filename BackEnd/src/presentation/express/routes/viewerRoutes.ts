import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { MatchesController } from "presentation/http/controllers/viewer/MatchesController";
import { ProfileController } from "presentation/http/controllers/viewer/ProfileController";
import { container } from "tsyringe";

const router = Router();
const upload = multer();

const viewerMatchesController = container.resolve(MatchesController)
const viewerProfileController = container.resolve(ProfileController)

router.get('/:viewerId', expressAdapter(viewerProfileController.getProfile));
router.put("/:viewerId", upload.single("file"), expressFileUpdateHandler(viewerProfileController.updateProfile));
router.get("/:viewerId/matches/live", expressAdapter(viewerMatchesController.getLiveMatches));
router.get("/:matchId/live/updates", expressAdapter(viewerMatchesController.getLiveUpdates));

export default router;