import { matchRepo, teamRepository, tournamentRepository } from "../shared/repositories";
import { logger } from "../shared/providers";

import { MatchesController } from "presentation/http/controllers/viewer/MatchesController";
import { GetLiveMatches } from "app/usecases/viewer/GetLiveMatches";
import { GetMatchUpdates } from "app/usecases/viewer/GetMatchUpdateData";

// Use cases
const getLiveMatchesUC = new GetLiveMatches(matchRepo, teamRepository, tournamentRepository, logger);
const getLiveUpdatesUC = new GetMatchUpdates(matchRepo);

// Controller
export const viewerMatchesController = new MatchesController(getLiveMatchesUC, getLiveUpdatesUC, logger);