import { MatchController } from "presentation/http/controllers/manager/MatchController";
import { matchRepo, matchRepository, playerRepository } from "../shared/repositories";
import { logger } from "../shared/providers";
import { MatchPlayerServices } from "infra/services/MatchPlayerServices";
import { SaveMatchData } from "app/usecases/manager/SaveMatchData";
import { InitInningsUseCase } from "app/usecases/manager/match/InitInningsUseCase";
import { AddRunsUseCase } from "app/usecases/manager/match/AddRunsUseCase";
import { SetStrikerUseCase } from "app/usecases/manager/match/SetStrikerUseCase";
import { SetNonStrikerUseCase } from "app/usecases/manager/match/SetNonStrikerUseCase";
import { SetBowlerUseCase } from "app/usecases/manager/match/SetBowlerUseCase";
import { AddWicketUseCase } from "app/usecases/manager/match/AddWicketUseCase";
import { MatchScoreService } from "infra/services/MatchStatsService";
import { GetLiveScoreUseCase } from "app/usecases/manager/match/GetLiveScoreUseCase";
import { UndoLastBallUseCase } from "app/usecases/manager/match/UndoLastBallUseCase";
import { StartSuperOverUseCase } from "app/usecases/manager/match/StartSuperOverUseCase";
import { AddExtrasUseCase } from "app/usecases/manager/match/AddExtrasUseCase";
import { EndOverUseCase } from "app/usecases/manager/match/EndOverUseCase";
import { EndInningsUseCase } from "app/usecases/manager/match/EndInningsUseCase";
import { AddPenaltyUseCase } from "app/usecases/manager/match/AddPenaltyUseCase";
import { RetireBatsmanUseCase } from "app/usecases/manager/match/RetireBatsmanUseCase";

export const getLiveScoreUC = new GetLiveScoreUseCase(matchRepo);
export const saveMatchDataUC = new SaveMatchData(matchRepository, logger);
export const initiInningsUC = new InitInningsUseCase(matchRepo);
export const addRunsUC = new AddRunsUseCase(matchRepo);
export const setStrikerUC = new SetStrikerUseCase(matchRepo);
export const setNonStrikerUC = new SetNonStrikerUseCase(matchRepo);
export const setBowlerUC = new SetBowlerUseCase(matchRepo);
export const addWicketUC = new AddWicketUseCase(matchRepo);
export const addExtrasUC = new AddExtrasUseCase(matchRepo);
export const undoLastBallUC = new UndoLastBallUseCase(matchRepo);
export const startSuperOverUC = new StartSuperOverUseCase(matchRepo);
export const endOverUC = new EndOverUseCase(matchRepo);
export const endInningsUC = new EndInningsUseCase(matchRepo);
export const addPenaltyUC = new AddPenaltyUseCase(matchRepo);
export const retireBatsmanUC = new RetireBatsmanUseCase(matchRepo);


const matchPlayerServices = new MatchPlayerServices(matchRepository, playerRepository);
const matchScoreServices = new MatchScoreService(initiInningsUC, addRunsUC, setStrikerUC, setNonStrikerUC, setBowlerUC,
    addWicketUC, addExtrasUC, undoLastBallUC, startSuperOverUC, endOverUC, endInningsUC, addPenaltyUC, retireBatsmanUC);

export const matchController = new MatchController(matchPlayerServices, matchScoreServices, saveMatchDataUC, getLiveScoreUC);