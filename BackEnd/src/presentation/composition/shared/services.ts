import { PlayerService } from "infra/services/PlayerService";
import { playerRepository, userRepository } from "./repositories";

export const playerServices = new PlayerService(userRepository,playerRepository);