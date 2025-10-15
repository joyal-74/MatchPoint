import type { PlayerProfileField } from "../../../types/Player";
import type { User } from "../../../types/User";


export interface Player extends User {
    sport : string;
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
