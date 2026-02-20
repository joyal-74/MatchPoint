export interface PointsRow {
    _id: string;
    tournamentId: string;
    teamId: string;
    team : string;
    teamLogo?: string;
    groupName?: string;
    
    rank: number;
    p: number;
    w: number;
    l: number;
    t: number;
    nrr: string;
    pts: number;
    form: string[];
}

export interface GroupData {
    groupName: string;
    rows: PointsRow[];
}

export interface PointsTableResponse {
    table?: PointsRow[];
    
    groups?: GroupData[];
}
