export interface ProfileField {
    key: string;
    label: string;
    type: string;
}

export interface CareerStatField {
    key: string;
    label: string;
    type: string;
}


export const sportProfileConfig: Record<string, ProfileField[]> = {
    cricket: [
        { key: "battingStyle", label: "Batting Style", type: "text" },
        { key: "bowlingStyle", label: "Bowling Style", type: "text" },
        { key: "position", label: "Position", type: "text" },
        { key: "jerseyNumber", label: "Jersey Number", type: "number" }
    ],
};

export const sportCareerStatsConfig: Record<string, Record<string, CareerStatField[]>> = {
    cricket: {
        batting: [
            { key: "matches", label: "Matches Played", type: "batting" },
            { key: "innings", label: "Innings Played", type: "batting" },
            { key: "runs", label: "Total Runs", type: "batting" },
            { key: "average", label: "Batting Average", type: "batting" },
            { key: "strikeRate", label: "Strike Rate", type: "batting" },
            { key: "hundreds", label: "Centuries", type: "batting" },
            { key: "fifties", label: "Half Centuries", type: "batting" },
            { key: "fours", label: "Fours", type: "batting" },
            { key: "sixes", label: "Sixes", type: "batting" },
            { key: "highestScore", label: "Highest Score", type: "batting" },
        ],
        bowling: [
            { key: "ballsBowled", label: "Balls Bowled", type: "bowling" },
            { key: "runsConceded", label: "Runs Conceded", type: "bowling" },
            { key: "wickets", label: "Wickets Taken", type: "bowling" },
            { key: "average", label: "Bowling Average", type: "bowling" },
            { key: "economy", label: "Economy Rate", type: "bowling" },
            { key: "strikeRate", label: "Bowling Strike Rate", type: "bowling" },
            { key: "fiveWicketHauls", label: "5-Wicket Hauls", type: "bowling" },
            { key: "tenWicketHauls", label: "10-Wicket Matches", type: "bowling" },
            { key: "bestFigures", label: "Best Bowling Figures", type: "bowling" }
        ],
        fielding: [
            { key: "catches", label: "Catches", type: "fielding" },
            { key: "stumpings", label: "Stumpings", type: "fielding" },
            { key: "runOuts", label: "Run Outs", type: "fielding" }
        ],
        general: [
            { key: "manOfTheMatch", label: "Man of the Match Awards", type: "general" },
            { key: "manOfTheSeries", label: "Man of the Series Awards", type: "general" }
        ]
    }
};
