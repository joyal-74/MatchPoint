import { IManagerIdGenerator, IPlayerIdGenerator, ITeamIdGenerator, ITournamentIdGenerator, IUmpireIdGenerator, IUserIdGenerator } from "../../app/providers/IIdGenerator";
import { nanoid } from 'nanoid';

export class TeamIdGenerator implements ITeamIdGenerator {
    generate(): string {
        return `TM-${nanoid(10)}`;
    }
}

export class TournamentIdGenerator implements ITournamentIdGenerator {
    generate(): string {
        return `TMT-${nanoid(10)}`;
    }
}

export class UserIdGenerator implements IUserIdGenerator {
    generate(): string {
        return `USR-${nanoid(10)}`;
    }
}

export class PlayerIdGenerator implements IPlayerIdGenerator {
    generate(): string {
        return `PLR-${nanoid(10)}`;
    }
}

export class ManagerIdGenerator implements IManagerIdGenerator {
    generate(): string {
        return `MNR-${nanoid(10)}`;
    }
}

export class UmpireIdGenerator implements IUmpireIdGenerator {
    generate(): string {
        return `UPR-${nanoid(10)}`;
    }
}
