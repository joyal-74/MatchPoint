import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { SettingsController } from "presentation/http/controllers/shared/SettingsController";

import { container } from "tsyringe";

const router = Router();

const settingsController = container.resolve(SettingsController)

router.post("/password/verify", expressAdapter(settingsController.verifyPassword));

router.patch("/password/update", expressAdapter(settingsController.updatePassword));

router.patch("/privacy", expressAdapter(settingsController.updatePrivacy));


export default router;