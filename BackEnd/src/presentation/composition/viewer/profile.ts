import { GetViewerProfile } from "app/usecases/viewer/GetViewerProfile";
import { userRepository } from "../shared/repositories";
import { imageKitfileProvider, logger } from "../shared/providers";
import { UpdateViewerProfile } from "app/usecases/viewer/UpdateViewerProfile";
import { ProfileController } from "presentation/http/controllers/viewer/ProfileController";

// Use cases
const getPlayerProfileUC = new GetViewerProfile(userRepository, logger);
const updatePlayerProfileUC = new UpdateViewerProfile(userRepository, imageKitfileProvider);

// Controller
export const viewerProfileController = new ProfileController(
    getPlayerProfileUC,
    updatePlayerProfileUC,
    logger
);