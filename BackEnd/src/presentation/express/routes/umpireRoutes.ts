import { Router } from "express";
import multer from "multer";
import { container } from "tsyringe";
import { ProfileController } from "../../http/controllers/umpire/ProfileController";
import { MatchController } from "../../http/controllers/umpire/MatchController";
import { expressAdapter } from "../../adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "../../adaptors/ExpressFileAdaptor";
import { umpireOnly } from "../middlewares/index";


const router = Router();
const upload = multer();

const umpireProfileController = container.resolve(ProfileController)
const umpireMatchController = container.resolve(MatchController)


router.get('/:umpireId/matches', umpireOnly, expressAdapter(umpireMatchController.getAllMatches));
router.put("/:umpireId", umpireOnly, upload.single("file"), expressFileUpdateHandler(umpireProfileController.updateProfile));
router.get('/:umpireId', umpireOnly, expressAdapter(umpireProfileController.getProfile));


export default router;
