import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { IWalletRepository } from "../../app/repositories/interfaces/shared/IWalletRepository.js";
import { ISubscriptionRepository } from "../../app/repositories/interfaces/shared/ISubscriptionRepository.js";
import { IPlayerRepository } from "../../app/repositories/interfaces/player/IPlayerRepository.js";
import { IManagerRepository } from "../../app/repositories/interfaces/manager/IManagerRepository.js";
import { UserRoles } from "../../domain/enums/Roles.js";
import { getDefaultCareerStats } from "../utils/playerDefaults.js";

@injectable()
export class ProfileInitializationService {
    constructor(
        @inject(DI_TOKENS.WalletRepository) private _walletRepo: IWalletRepository,
        @inject(DI_TOKENS.SubscriptionRepository) private _subRepo: ISubscriptionRepository,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.ManagerRepository) private _managerRepo: IManagerRepository,
    ) { }

    async initialize(user: any, additionalData: any = {}) {
        // 1. Wallet
        await this._walletRepo.create({
            ownerId: user._id,
            ownerType: 'USER',
            balance: 0,
            currency: 'INR',
            isFrozen: false
        });

        // 2. Subscription
        await this._subRepo.create({
            userId: user._id,
            level: 'Free',
            status: 'active',
        });

        // 3. Role-Specific
        switch (user.role) {
            case UserRoles.Player: {
                const sport = additionalData.sport || user.sport || 'cricket';

                await this._playerRepo.create({
                    userId: user._id,
                    sport: sport,
                    profile: {
                        // Map the flat userData to the profile structure
                        battingStyle: additionalData.battingStyle || user.battingStyle,
                        bowlingStyle: additionalData.bowlingStyle || user.bowlingStyle,
                        position: additionalData.playingPosition || user.playingPosition,
                        jerseyNumber: additionalData.jerseyNumber || user.jerseyNumber,
                    },
                    stats: getDefaultCareerStats(sport),
                });
                break;

            }

            case UserRoles.Manager:
                await this._managerRepo.create({
                    userId: user._id,
                    tournamentsCreated: [],
                    teams: [],
                });
                break;
        }
    }
}