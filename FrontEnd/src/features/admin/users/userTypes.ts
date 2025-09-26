export interface User {
    _id: string;
    userId: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    createdAt: string;
    isActive : boolean;
}

export interface Player extends User {
    sport : string;
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
