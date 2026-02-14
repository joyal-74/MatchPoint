import { WinstonLogger } from "../providers/WinstonLogger.js";
import { JWTService } from "../services/jwtServices.js";
import { NodeMailerService } from "../services/NodeMailerService.js";
import { NodeOtpGenerator } from "../providers/NodeOtpGenerator.js";
import { BcryptPasswordHasher } from "../providers/BcryptPasswordHasher.js";
import { ImageKitFileStorage } from "../providers/ImageKitFileStorage.js";
import { WalletProvider } from "../providers/WalletProvider.js";
import { RazorpayProvider } from "../providers/RazorpayProvider.js";
import { ManagerIdGenerator, PlayerIdGenerator, TeamIdGenerator, TournamentIdGenerator, UmpireIdGenerator, UserIdGenerator } from "../providers/IdGenerator.js";
import { RoleIdGenerator } from "../providers/RoleIdGenerator.js";
import { EnvConfigProvider } from "../providers/EnvConfigProvider.js";
import { RoomRegistry } from "../livestream/mediasoup/RoomRegistry.js";
import { MongoUnitOfWork } from "../repositories/mongo/MongoUnitOfWork.js";
import { container } from "tsyringe"; 
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { NodeCronScheduler } from "../../infra/services/NodeCronScheduler.js";
import { CryptoEncryptionProvider } from "../providers/CryptoEncryptionProvider.js";
import { WalletPaymentStrategy } from "../strategies/WalletPaymentStrategy.js";
import { TournamentPaymentStrategy } from "../strategies/TournamentPaymentStrategy.js";
import { SubscriptionPaymentStrategy } from "../strategies/SubscriptionPaymentStrategy.js";
import { PaymentStrategyRegistry } from "../providers/PaymentStrategyRegistry.js";
import { WalletTournamentProcessor } from "../providers/WalletTournamentProcessor.js";
import { RazorpayTournamentProcessor } from "../providers/RazorpayTournamentProcessor.js";
import { RazorpayXPayoutProvider } from "../providers/RazorpayXPayoutProvider.js";



container.register(DI_TOKENS.Logger, { useClass: WinstonLogger });
container.register(DI_TOKENS.JWTService, { useClass: JWTService });
container.register(DI_TOKENS.Mailer, { useClass: NodeMailerService });
container.register(DI_TOKENS.OtpGenerator, { useClass: NodeOtpGenerator });
container.register(DI_TOKENS.PasswordHasher, { useClass: BcryptPasswordHasher });
container.register(DI_TOKENS.FileStorage, { useClass: ImageKitFileStorage });
container.register(DI_TOKENS.ConfigProvider, { useClass: EnvConfigProvider });
container.register(DI_TOKENS.RoomRegistry, { useClass: RoomRegistry });
container.register(DI_TOKENS.UnitOfWork, { useClass: MongoUnitOfWork });
container.register(DI_TOKENS.Scheduler, { useClass: NodeCronScheduler });


// ID Generators
container.register(DI_TOKENS.UserIdGenerator, { useClass: UserIdGenerator });
container.register(DI_TOKENS.ManagerIdGenerator, { useClass: ManagerIdGenerator });
container.register(DI_TOKENS.PlayerIdGenerator, { useClass: PlayerIdGenerator });
container.register(DI_TOKENS.TeamIdGenerator, { useClass: TeamIdGenerator });
container.register(DI_TOKENS.TournamentIdGenerator, { useClass: TournamentIdGenerator });
container.register(DI_TOKENS.RoleIdGenerator, { useClass: RoleIdGenerator });
container.register(DI_TOKENS.UmpireIdGenerator, { useClass: UmpireIdGenerator });

container.registerSingleton(DI_TOKENS.PaymentStrategyRegistry, PaymentStrategyRegistry);

container.register(DI_TOKENS.PaymentProvider, { useClass: RazorpayProvider });

container.register(DI_TOKENS.EncryptionProvider, { 
    useFactory: () => {
        const key = process.env.PAYOUT_ENCRYPTION_KEY;
        if (!key || key.length !== 32) {
            throw new Error("Encryption Key must be exactly 32 characters. Check your .env file.");
        }
        return new CryptoEncryptionProvider(key);
    }
});

container.register(DI_TOKENS.WalletProvider, { useClass: WalletProvider });

container.register(DI_TOKENS.PaymentStrategy, { useClass: WalletPaymentStrategy });
container.register(DI_TOKENS.PaymentStrategy, { useClass: TournamentPaymentStrategy });
container.register(DI_TOKENS.PaymentStrategy, { useClass: SubscriptionPaymentStrategy });

container.register(DI_TOKENS.TournamentPaymentProcessor, { useClass: WalletTournamentProcessor });
container.register(DI_TOKENS.TournamentPaymentProcessor, { useClass: RazorpayTournamentProcessor });
container.register(DI_TOKENS.PayoutProvider, { useClass: RazorpayXPayoutProvider });
