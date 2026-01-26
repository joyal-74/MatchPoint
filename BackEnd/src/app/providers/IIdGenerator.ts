export interface IUserIdGenerator {
    generate(): string;
}

export interface IManagerIdGenerator {
    generate(): string;
}

export interface IPlayerIdGenerator {
    generate(): string;
}

export interface ITeamIdGenerator {
    generate(): string;
}

export interface ITournamentIdGenerator {
    generate(): string;
}

export interface IUmpireIdGenerator {
    generate(): string;
}

export interface IRoleIdGenerator {
    generate(role: string): string;
}