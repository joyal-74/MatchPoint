import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { settingsController } from "presentation/composition/shared/settings";


const router = Router();

router.post("/password/verify", expressAdapter(settingsController.verifyPassword));

router.patch("/password/update", expressAdapter(settingsController.updatePassword));

router.patch("/privacy", expressAdapter(settingsController.updatePrivacy));


export default router;