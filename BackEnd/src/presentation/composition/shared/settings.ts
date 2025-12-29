import { VerifyPasswordUseCase } from "app/usecases/shared/VerifyPasswordUseCase";
import { SettingsController } from "presentation/http/controllers/shared/SettingsController";
import { settingsRepo } from "./repositories";
import { UpdatePasswordUseCase } from "app/usecases/shared/UpdatePasswordUseCase";
import { UpdatePrivacyUseCase } from "app/usecases/shared/UpdatePrivacyUseCase";
import { passwordHasher } from "./providers";


const verifyPasswordUC = new VerifyPasswordUseCase(settingsRepo, passwordHasher);
const updatePasswordUC = new UpdatePasswordUseCase(settingsRepo, passwordHasher);
const VerifyPrivacyUC = new UpdatePrivacyUseCase(settingsRepo);


export const settingsController = new SettingsController(verifyPasswordUC, updatePasswordUC, VerifyPrivacyUC);