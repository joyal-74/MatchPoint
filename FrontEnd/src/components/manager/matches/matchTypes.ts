import type { Team } from "../../../features/manager/Matches/matchTypes";

export interface MatchData {
    matchNo: number;
    team1: Team;
    team2: Team;
    venue: string;
    date: string;
    time: string;
    overs: number;
}

export type TossDecision = 'Batting' | 'Bowling' | null;
export type TeamId = string;
