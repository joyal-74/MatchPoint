export interface StatsRow {
    Format: string;
    Mot: number;
    Inns: number;
    NO: number;
    Runs: string | number;
    HS: string | number;
    Ave: number;
    BF: string | number;
    SR: string | number;
    '100s': number;
    '50s': number;
    '6s': number;
    '4s': number;
    Ct: number;
    St: number;
}

export interface StatsSectionData {
    title: string;
    headers: (keyof StatsRow)[];
    data: StatsRow[];
}