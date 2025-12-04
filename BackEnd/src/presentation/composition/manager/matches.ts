import { MatchController } from "presentation/http/controllers/manager/MatchController";
import { matchRepository, matchScoreRepository, playerRepository } from "../shared/repositories";
import { logger } from "../shared/providers";
import { MatchPlayerServices } from "infra/services/MatchPlayerServices";
import { SaveMatchData } from "app/usecases/manager/SaveMatchData";
import { InitInningsUseCase } from "app/usecases/manager/match/InitInningsUseCase";
import { AddRunsUseCase } from "app/usecases/manager/match/AddRunsUseCase";
import { SetStrikerUseCase } from "app/usecases/manager/match/SetStrikerUseCase";
import { SetNonStrikerUseCase } from "app/usecases/manager/match/SetNonStrikerUseCase";
import { SetBowlerUseCase } from "app/usecases/manager/match/SetBowlerUseCase";
import { AddWicketUseCase } from "app/usecases/manager/match/AddWicketUseCase";
import { MatchScoreService } from "infra/services/matchStatsService";
import { GetLiveScoreUseCase } from "app/usecases/manager/match/GetLiveScoreUseCase";

export const getLiveScoreUC = new GetLiveScoreUseCase(matchScoreRepository);
export const saveMatchDataUC = new SaveMatchData(matchRepository, logger);
export const initiInningsUC = new InitInningsUseCase(matchScoreRepository);
export const addRunsUC = new AddRunsUseCase(matchScoreRepository);
export const setStrikerUC = new SetStrikerUseCase(matchScoreRepository);
export const setNonStrikerUC = new SetNonStrikerUseCase(matchScoreRepository);
export const setBowlerUC = new SetBowlerUseCase(matchScoreRepository);
export const addWicketUC = new AddWicketUseCase(matchScoreRepository);

const matchPlayerServices = new MatchPlayerServices(matchRepository,playerRepository);
const matchScoreServices = new MatchScoreService(initiInningsUC, addRunsUC,setStrikerUC,setNonStrikerUC,setBowlerUC, addWicketUC);

export const matchController = new MatchController(matchPlayerServices, matchScoreServices, saveMatchDataUC,getLiveScoreUC, logger);