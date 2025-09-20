import { Router } from "express";
import multer from "multer";
import { expressProfileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { updateManagerProfileController } from "presentation/container/container"; 

const router = Router();
const upload = multer();

router.put("/profile", upload.single("logo"), expressProfileUpdateHandler(updateManagerProfileController));

export default router;