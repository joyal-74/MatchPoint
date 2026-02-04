import { Router } from "express";

import { container } from "tsyringe";
import { SettingsController } from "../../http/controllers/shared/SettingsController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";

const router = Router();

const settingsController = container.resolve(SettingsController)

router.post("/password/verify", expressAdapter(settingsController.verifyPassword));

router.patch("/password/update", expressAdapter(settingsController.updatePassword));

router.patch("/privacy", expressAdapter(settingsController.updatePrivacy));


export default router;
