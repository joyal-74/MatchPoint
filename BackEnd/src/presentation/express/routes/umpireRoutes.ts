import { Router } from "express";
import multer from "multer";
import { container } from "tsyringe";
import { ProfileController } from "../../http/controllers/umpire/ProfileController.js";
import { MatchController } from "../../http/controllers/umpire/MatchController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { expressFileUpdateHandler } from "../../adaptors/ExpressFileAdaptor.js";



const router = Router();
const upload = multer();

const umpireProfileController = container.resolve(ProfileController)
const umpireMatchController = container.resolve(MatchController)


router.get('/matches', expressAdapter(umpireMatchController.getAllMatches));
router.put("/:umpireId", upload.single("file"), expressFileUpdateHandler(umpireProfileController.updateProfile));
router.get('/:umpireId', expressAdapter(umpireProfileController.getProfile));


export default router;
