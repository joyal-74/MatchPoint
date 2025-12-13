import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { viewerMatchesController } from "presentation/composition/viewer/matches";
import { viewerProfileController } from "presentation/composition/viewer/profile";

const router = Router();
const upload = multer();

router.get('/:viewerId', expressAdapter(viewerProfileController.getProfile));
router.put("/:viewerId", upload.single("file"), expressFileUpdateHandler(viewerProfileController.updateProfile));
router.get("/:viewerId/matches/live", expressAdapter(viewerMatchesController.getLiveMatches));
router.get("/:matchId/live/updates", expressAdapter(viewerMatchesController.getLiveUpdates));

export default router;