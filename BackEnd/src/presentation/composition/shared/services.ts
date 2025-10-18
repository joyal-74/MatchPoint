import { PlayerService } from "infra/services/PlayerService";
import { adminRepository, playerRepository, teamRepository, userRepository } from "./repositories";
import { LogoutService } from "infra/services/LogoutService";
import { PlayerTeamServices } from "infra/services/PlayerTeamServices";

export const playerServices = new PlayerService(userRepository,playerRepository);
export const logoutServices = new LogoutService(userRepository, adminRepository);
export const teamServices = new PlayerTeamServices(teamRepository);