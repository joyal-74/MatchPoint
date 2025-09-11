import type { ApiUser } from "./UserApi";

export interface PlayerProfileField {
    key: string;
    label: string;
    type: string;
}

export interface PlayerStatsField {
    key: string;
    label: string;
    type: string;
}

export interface PlayerTournament {
    tournament_id: string;
    key: string;
    label: string;
    type: string;
}

export interface ApiPlayer extends ApiUser {
  sport: string;
  profile: PlayerProfileField[];
  carier_stats: PlayerStatsField[];
  tournaments: PlayerTournament[];
}