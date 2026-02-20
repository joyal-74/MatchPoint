import { Router } from "express";
import multer from "multer";
import { container } from "tsyringe";
import { ProfileController } from "../../http/controllers/umpire/ProfileController.js";
import { MatchController } from "../../http/controllers/umpire/MatchController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { expressFileUpdateHandler } from "../../adaptors/ExpressFileAdaptor.js";
import { umpireOnly } from "../middlewares/index.js";


const router = Router();
const upload = multer();

const umpireProfileController = container.resolve(ProfileController)
const umpireMatchController = container.resolve(MatchController)


router.get('/:umpireId/matches', umpireOnly, expressAdapter(umpireMatchController.getAllMatches));
router.put("/:umpireId", umpireOnly, upload.single("file"), expressFileUpdateHandler(umpireProfileController.updateProfile));
router.get('/:umpireId', umpireOnly, expressAdapter(umpireProfileController.getProfile));


export default router;