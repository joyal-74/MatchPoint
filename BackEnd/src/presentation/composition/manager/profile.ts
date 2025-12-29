import { UpdateManagerProfile } from "app/usecases/manager/UpdateManagerProfile";
import { GetManagerProfile } from "app/usecases/manager/GetManagerProfile";
import { ProfileController } from "presentation/http/controllers/manager/ProfileController";
import { UserRepositoryMongo } from "infra/repositories/mongo/UserRepositoryMongo";
import { ImageKitFileStorage } from "infra/providers/ImageKitFileStorage";
import { GetManagerFinancialsUseCase } from "app/usecases/player/GetManagerFinancialsUseCase";
import { finacialRepo } from "../shared/repositories";
import { FinancialsController } from "presentation/http/controllers/manager/FinancialsController";

const userRepository = new UserRepositoryMongo();
const imageKitfileProvider = new ImageKitFileStorage();

const updateManagerProfile = new UpdateManagerProfile(userRepository, imageKitfileProvider);
const getManagerProfile = new GetManagerProfile(userRepository);

export const managerProfileController = new ProfileController(
    getManagerProfile,
    updateManagerProfile
);


const getManagerFinancialsUseCase = new GetManagerFinancialsUseCase(finacialRepo);

export const financialsController = new FinancialsController(getManagerFinancialsUseCase);