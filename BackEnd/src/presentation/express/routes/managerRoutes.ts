import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { teamManagementController, updateManagerProfileController } from "presentation/container/container";

const router = Router();
const upload = multer();

router.put("/profile", upload.single("logo"), expressFileUpdateHandler(updateManagerProfileController.updateProfile));

router.post('/teams/change', expressAdapter(teamManagementController.changePlayerStatus));

router.get('/teams/:managerId', expressAdapter(teamManagementController.getAllTeams));

router.post("/team", upload.single("logo"), expressFileUpdateHandler(teamManagementController.addNewTeam));

export default router;