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

// Specialized Providers (Requiring Constructor Args from Env)
container.register(DI_TOKENS.RazorpayProvider, { 
    useFactory: () => new RazorpayProvider(
        process.env.RAZOR_API_KEY || "", 
        process.env.RAZOR_API_SECRET || ""
    ) 
});

container.register(DI_TOKENS.WalletProvider, { useClass: WalletProvider });
