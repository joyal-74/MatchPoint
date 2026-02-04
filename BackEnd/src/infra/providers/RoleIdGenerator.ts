import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";

import { IManagerIdGenerator, IPlayerIdGenerator, IRoleIdGenerator, IUserIdGenerator } from "../../app/providers/IIdGenerator.js";

@injectable()
export class RoleIdGenerator implements IRoleIdGenerator {
    constructor(
        @inject(DI_TOKENS.PlayerIdGenerator) private playerIdGen: IPlayerIdGenerator,
        @inject(DI_TOKENS.UserIdGenerator) private viewerIdGen: IUserIdGenerator,
        @inject(DI_TOKENS.ManagerIdGenerator) private managerIdGen: IManagerIdGenerator,
    ) { }

    generate(role: string): string {
        switch (role) {
            case "player":
                return this.playerIdGen.generate();
            case "manager":
                return this.managerIdGen.generate();
            default:
                return this.viewerIdGen.generate();
        }
    }
}
