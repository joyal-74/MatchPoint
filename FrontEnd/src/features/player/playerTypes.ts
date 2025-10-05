export interface Team {
    _id: string;
    teamId: string;
    managerId: string;
    name: string;
    logo: string;
    sport: string;
    description: string;
    maxPlayers: number;
    members: string[];
    state: string;
    city: string;
    stats: {
        totalMatches: number;
        winRate: number;
    };
    phase: "recruiting" | "active" | "completed";
    created: string;
}


export interface Filters {
    sport?: string;
    state?: string;
    city?: string;
    phase?: "recruiting" | "active" | "completed";
    maxPlayers?: number;
}