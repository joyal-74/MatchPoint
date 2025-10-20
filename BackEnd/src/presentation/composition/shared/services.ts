import { PlayerService } from "infra/services/PlayerService";
import { adminRepository, playerRepository, registrationRepository, teamRepository, userRepository } from "./repositories";
import { LogoutService } from "infra/services/LogoutService";
import { PlayerTeamServices } from "infra/services/PlayerTeamServices";
import { TournamentRegistrationValidator } from "infra/services/TournamentRegistrationValidator";

export const playerServices = new PlayerService(userRepository,playerRepository);
export const logoutServices = new LogoutService(userRepository, adminRepository);
export const teamServices = new PlayerTeamServices(teamRepository);
export const tournamentRegistrationServices = new TournamentRegistrationValidator(registrationRepository,teamRepository);