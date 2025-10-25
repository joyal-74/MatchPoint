import { PlayerService } from "infra/services/PlayerService";
import { adminRepository, playerRepository, registrationRepository, teamRepository, userRepository } from "./repositories";
import { LogoutService } from "infra/services/LogoutService";
import { PlayerTeamServices } from "infra/services/PlayerTeamServices";
import { TournamentRegistrationValidator } from "infra/services/TournamentRegistrationValidator";
import { RoleIdGenerator } from "infra/providers/RoleIdGenerator";
import { ManagerIdGenerator, PlayerIdGenerator, UserIdGenerator } from "infra/providers/IdGenerator";

export const playerServices = new PlayerService(userRepository,playerRepository);
export const logoutServices = new LogoutService(userRepository, adminRepository);
export const teamServices = new PlayerTeamServices(teamRepository);
export const tournamentRegistrationServices = new TournamentRegistrationValidator(registrationRepository,teamRepository);
export const playerIdGenerator = new PlayerIdGenerator()
export const managerIdGenerator = new ManagerIdGenerator()
export const userIdGenerator = new UserIdGenerator()
export const roleIdGenerator = new RoleIdGenerator(playerIdGenerator, userIdGenerator, managerIdGenerator)