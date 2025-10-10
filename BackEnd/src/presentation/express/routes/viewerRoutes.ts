import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { viewerProfileController } from "presentation/composition/viewer/profile";

const router = Router();
const upload = multer();

router.get('/:viewerId', expressAdapter(viewerProfileController.getProfile));
router.put("/:viewerId", upload.single("file"), expressFileUpdateHandler(viewerProfileController.updateProfile));

export default router;