import { PlayerProfileController } from 'presentation/http/controllers/player/ProfileController';
import { GetPlayerProfile } from 'app/usecases/player/GetPlayerProfile';
import { UpdatePlayerProfile } from 'app/usecases/player/UpdatePlayerProfile';
import { userRepository } from '../shared/repositories';
import { imageKitfileProvider, logger } from '../shared/providers';

// Use cases
const getPlayerProfileUC = new GetPlayerProfile(userRepository, logger);
const updatePlayerProfileUC = new UpdatePlayerProfile(userRepository, imageKitfileProvider);

// Controller
export const playerProfileController = new PlayerProfileController(
    getPlayerProfileUC,
    updatePlayerProfileUC,
    logger
);
