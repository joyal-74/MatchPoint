type Batsman = {
    name: string;
    runs: number;
    balls: number;
    strike?: boolean;
};


export type Bowler = {
    name: string;
    figures: string;
    overs?: string;
};

export type OverlayData = {
    runs: number;
    wickets: number;
    overs: string;
    target: number;
    batsman1: Batsman;
    batsman2: Batsman;
    bowler?: Bowler;
    recentBalls: string[];
};
