import { MatchController } from "presentation/http/controllers/manager/MatchController";
import { matchRepository, playerRepository } from "../shared/repositories";
import { logger } from "../shared/providers";
import { MatchPlayerServices } from "infra/services/MatchPlayerServices";
import { SaveMatchData } from "app/usecases/manager/SaveMatchData";

const matchPlayerServices = new MatchPlayerServices(matchRepository,playerRepository);
const saveMatchDataUC = new SaveMatchData(matchRepository, logger);

export const matchController = new MatchController(matchPlayerServices,saveMatchDataUC, logger);