export interface MatchStatsEntity {
  matchId: string;
  currentInnings: number;
  innings1?: InningsEntity | null;
  innings2?: InningsEntity | null;
  superOver1?: InningsEntity | null;
  superOver2?: InningsEntity | null;
  isLive: boolean;
  overs: number;
}

export interface InningsEntity {
  runs: number;
  balls: number;
  wickets: number;
  currentStriker: string | null;
  currentNonStriker: string | null;
  currentBowler: string | null;
  battingTeam: string;
  bowlingTeam: string;
  batsmen: PlayerBattingStats[];
  bowlers: PlayerBowlingStats[];
  extras: ExtraStats;
  logs: BallLogEntry[];
  isCompleted: boolean;
  isSuperOver: boolean;
}
