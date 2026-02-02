import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { container } from "tsyringe";
import { ProfileController } from "presentation/http/controllers/umpire/ProfileController";
import { MatchController } from "presentation/http/controllers/umpire/MatchController";


const router = Router();
const upload = multer();

const umpireProfileController = container.resolve(ProfileController)
const umpireMatchController = container.resolve(MatchController)


router.get('/matches', expressAdapter(umpireMatchController.getAllMatches));
router.put("/:umpireId", upload.single("file"), expressFileUpdateHandler(umpireProfileController.updateProfile));
router.get('/:umpireId', expressAdapter(umpireProfileController.getProfile));


export default router;