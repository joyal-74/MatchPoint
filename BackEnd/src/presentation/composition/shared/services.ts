import { PlayerService } from "infra/services/PlayerService";
import { adminRepository, matchRepository, playerRepository, registrationRepository, teamRepository, transactionRepo, userRepository } from "./repositories";
import { LogoutService } from "infra/services/LogoutService";
import { PlayerTeamServices } from "infra/services/PlayerTeamServices";
import { TournamentRegistrationValidator } from "infra/services/TournamentRegistrationValidator";
import { UserServices } from "infra/services/UserServices";
import { jwtService, roleIdGenerator, roomRegistry, unitOfWork, walletRepository } from "./providers";
import { GoogleAuthService } from "infra/services/GoogleAuthServices";
import { EnvConfigProvider } from "infra/providers/EnvConfigProvider";
import { UserAuthServices } from "infra/services/UserAuthServices";
import { FacebookServices } from "infra/services/FacebookServices";
import { LiveStreamService } from "infra/services/LiveStreamService";
import { TransactionService } from "infra/services/TransactionService";


export const playerServices = new PlayerService(userRepository, playerRepository);
export const logoutServices = new LogoutService(userRepository, adminRepository);
export const teamServices = new PlayerTeamServices(teamRepository);
export const tournamentRegistrationServices = new TournamentRegistrationValidator(registrationRepository, teamRepository);
export const userServices = new UserServices(userRepository, roleIdGenerator);
export const configProvider = new EnvConfigProvider();
export const googleAuthService = new GoogleAuthService(configProvider);
export const userAuthService = new UserAuthServices(userRepository, jwtService);
export const facebookServices = new FacebookServices();
export const livestreamServices = new LiveStreamService(roomRegistry, matchRepository);
export const transactionServices = new TransactionService(walletRepository,transactionRepo, unitOfWork);