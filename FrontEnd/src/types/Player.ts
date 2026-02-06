import type { playerStatus } from "../components/manager/teams/Types";
import type { UserProfile } from "./Profile";
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
    _id: string
    sport: string;
    profile: Record<string, string>;
    stats: {
        batting?: Record<string, number | string>;
        bowling?: Record<string, number | string>;
        fielding?: Record<string, number | string>;
        general?: Record<string, number | string>;
    };
    tournaments: PlayerTournament[];
}

export interface PlayerProfile extends UserProfile {
    sport: string;
    profile: Record<string, string>;
}

export interface playerProfileData {
    sport: string;
    profile: Record<string, string | number>;
}

export interface PlayerCardProps {
    player: Player;
    onAction: (action: "swap" | "makeSubstitute" | "makeBench" | "view", player: Player) => void;
    isSelected: boolean;
    swapMode: boolean;
    compact?: boolean;
}

export type TeamPlayer = {
    _id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    position: string;
    jerseyNumber: number;
    status: playerStatus;
    profileImage: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
}