export type TeamStatus = 'active' | 'blocked' | 'deleted'
export type playerStatus = "playing" | "sub";

export interface TeamMember {
    playerId: string;
    status: "playing" | "sub";
}

export interface TeamRegister {
    teamId: string;
    managerId: string;
    name: string;
    logo: string;
    sport: string;
    description: string;
    maxPlayers : number;
    members: TeamMember[];
    status: TeamStatus,
}

export interface TeamData extends TeamRegister {
    _id: string;
    created: Date,
}