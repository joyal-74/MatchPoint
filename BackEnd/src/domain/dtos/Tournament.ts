import { paymentStatus } from "../../domain/entities/Payment.js";
import { TeamPhase, TeamStatus } from "./Team.dto.js";
import { PlayerEntity } from "../../domain/entities/Player.js";

export interface TournamentTeamData {
    _id: string;
    teamId: string;
    name: string;
    logo: string;
    sport: string;
    state: string;
    city: string;
    status: TeamStatus;
    phase: TeamPhase;
    captain: string;
    managerId: string;
    paymentStatus: paymentStatus;
    createdAt: Date;
}

export interface TourTeamMemberData {
    _id: string;
    teamId: string;
    name: string;
    logo: string;
    members : PlayerEntity[];
}
