import type { User } from "./User";

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

export interface Player extends User {
    id:string
    sport: string;
    profile: PlayerProfileField[];
    career_stats: PlayerStatsField[];
    tournaments: PlayerTournament[];
}


export interface PlayerCardProps {
    player: Player;
    onAction: (action: "swap" | "makeSubstitute" | "makeBench" | "view", player: Player) => void;
    isSelected: boolean;
    swapMode: boolean;
    compact?: boolean;
}
