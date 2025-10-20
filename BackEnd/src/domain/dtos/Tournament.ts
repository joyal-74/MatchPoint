import { paymentStatus } from "domain/entities/Payment";
import { TeamPhase, TeamStatus } from "./Team.dto";

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
    paymentStatus: paymentStatus;
    createdAt: Date;
}