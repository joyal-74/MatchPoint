import type { User } from "./User";

export interface Manager extends User {
    sport : string;
    tournaments : string[];
}