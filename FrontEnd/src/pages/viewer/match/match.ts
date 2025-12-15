// export interface BattingStat {
//     playerId: string;
//     runs: number;
//     balls: number;
//     fours: number;
//     sixes: number;
//     strikeRate: string;
//     out: boolean;
//     fielderId: string | null;
//     isRetiredHurt: boolean;
// }

// export interface BowlingStat {
//     playerId: string;
//     runsConceded: number;
//     wickets: number;
//     balls: number;
//     overs: number;
//     economy: string;
// }

// export interface Innings {
//     battingTeamId: string;
//     bowlingTeamId: string;
//     runs: number;
//     wickets: number;
//     balls: number;
//     overs: number;
//     currentRunRate: string;
//     isCompleted: boolean;
//     currentBowler: string | null;
//     battingStats: BattingStat[];
//     bowlingStats: BowlingStat[];
//     extras: any; // Define extras strictly if needed
// }

// export interface MatchData {
//     innings1: Innings;
//     innings2: Innings;
//     currentInnings: number;
//     tossWinner: string;
//     tossDecision: 'Batting' | 'Bowling';
//     winner: string;
//     status: string;
//     matchType: string;
//     tournamentName: string;
//     venue: string;
//     oversLimit: number;
// }