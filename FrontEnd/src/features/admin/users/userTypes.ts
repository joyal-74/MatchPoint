import type { PlayerProfileField } from "../../../types/Player";
import type { User } from "../../../types/User";


export interface Player extends User {
    sport: string;
    profile: PlayerProfileField[];
}


export interface UserState {
    viewers: User[];
    players: Player[];
    managers: User[];
    loading: boolean;
    error: string | null;
    totalCount: number,
}

export const initialState: UserState = {
    viewers: [],
    players: [],
    managers: [],
    loading: false,
    error: null,
    totalCount: 0,
};


export interface ManagerDetails {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    subscription: string;
    joinedAt: string;
    profileImage: string;
    stats: {
        tournamentsCreated: number;
        tournamentsParticipated: number;
        totalTeams: number;
    };
    isBlocked?: boolean;
}

export interface PlayerDetails {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    subscription: string;
    joinedAt: string;
    profileImage: string;
    stats: {
        battingStyle: string;
        bowlingStyle: string;
        position: string;
    };
    isBlocked?: boolean;
}

export interface viewerDetails {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    subscription: string;
    joinedAt: string;
    profileImage: string;
    isBlocked?: boolean;
}