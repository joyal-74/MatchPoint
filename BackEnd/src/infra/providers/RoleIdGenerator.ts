import { IManagerIdGenerator, IPlayerIdGenerator, IRoleIdGenerator, IUserIdGenerator } from "app/providers/IIdGenerator";

export class RoleIdGenerator implements IRoleIdGenerator {
    constructor(
        private playerIdGen: IPlayerIdGenerator,
        private viewerIdGen: IUserIdGenerator,
        private managerIdGen: IManagerIdGenerator,
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