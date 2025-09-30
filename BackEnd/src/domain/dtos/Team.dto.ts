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
    status: boolean
}

export interface TeamData extends TeamRegister {
    _id: string;
    created: Date,
}