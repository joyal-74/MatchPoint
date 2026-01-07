// 1. Providers
import { WinstonLogger } from "../providers/WinstonLogger";
import { JWTService } from "../services/jwtServices";
import { NodeMailerService } from "../services/NodeMailerService";
import { NodeOtpGenerator } from "../providers/NodeOtpGenerator";
import { BcryptPasswordHasher } from "../providers/BcryptPasswordHasher";
import { ImageKitFileStorage } from "../providers/ImageKitFileStorage";
import { WalletProvider } from "../providers/WalletProvider";
import { RazorpayProvider } from "../providers/RazorpayProvider";
import { ManagerIdGenerator, PlayerIdGenerator, TeamIdGenerator, TournamentIdGenerator, UserIdGenerator } from "../providers/IdGenerator";
import { RoleIdGenerator } from "../providers/RoleIdGenerator";
import { EnvConfigProvider } from "../providers/EnvConfigProvider";
import { RoomRegistry } from "../livestream/mediasoup/RoomRegistry";
import { MongoUnitOfWork } from "../repositories/mongo/MongoUnitOfWork";
import { container } from ".";
import { DI_TOKENS } from "domain/constants/Identifiers";



container.register(DI_TOKENS.Logger, { useClass: WinstonLogger });
container.register(DI_TOKENS.JWTService, { useClass: JWTService });
container.register(DI_TOKENS.Mailer, { useClass: NodeMailerService });
container.register(DI_TOKENS.OtpGenerator, { useClass: NodeOtpGenerator });
container.register(DI_TOKENS.PasswordHasher, { useClass: BcryptPasswordHasher });
container.register(DI_TOKENS.FileStorage, { useClass: ImageKitFileStorage });
container.register(DI_TOKENS.ConfigProvider, { useClass: EnvConfigProvider });
container.register(DI_TOKENS.RoomRegistry, { useClass: RoomRegistry });
container.register(DI_TOKENS.UnitOfWork, { useClass: MongoUnitOfWork });


// ID Generators
container.register(DI_TOKENS.UserIdGenerator, { useClass: UserIdGenerator });
container.register(DI_TOKENS.ManagerIdGenerator, { useClass: ManagerIdGenerator });
container.register(DI_TOKENS.PlayerIdGenerator, { useClass: PlayerIdGenerator });
container.register(DI_TOKENS.TeamIdGenerator, { useClass: TeamIdGenerator });
container.register(DI_TOKENS.TournamentIdGenerator, { useClass: TournamentIdGenerator });
container.register(DI_TOKENS.RoleIdGenerator, { useClass: RoleIdGenerator });

// Specialized Providers (Requiring Constructor Args from Env)
container.register(DI_TOKENS.RazorpayProvider, { 
    useFactory: () => new RazorpayProvider(
        process.env.RAZOR_API_KEY || "", 
        process.env.RAZOR_API_SECRET || ""
    ) 
});

container.register(DI_TOKENS.WalletProvider, { useClass: WalletProvider });