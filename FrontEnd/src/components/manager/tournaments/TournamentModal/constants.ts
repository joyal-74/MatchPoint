import type { Tournament } from "../../../../features/manager/managerTypes";
import type { TournamentFormData, updateTournamentFormData } from "./types";

export const sports = ["Cricket"];
export const formats = ["Knockout", "League", "Friendly"];

export const initialFormData = (managerId: string): TournamentFormData => ({
    title: "",
    managerId,
    description: "",
    sport: "",
    startDate: new Date(),
    endDate: new Date(),
    regDeadline : new Date(),
    location: "",
    maxTeams: 0,
    minTeams: 0,
    entryFee: "",
    format: 'knockout',
    prizePool: 0
});

export const initialEditFormData = (managerId: string, id: string): updateTournamentFormData => ({
    _id: "",
    tourId: id,
    title: "",
    managerId,
    description: "",
    sport: "",
    startDate: new Date(),
    regDeadline: new Date(),
    endDate: new Date(),
    location: "",
    maxTeams: 0,
    minTeams: 0,
    entryFee: "",
    format: 'knockout',
    prizePool: 0,
    status: 'ongoing'
});


export const mapTournamentToFormData = (tournament: Tournament): updateTournamentFormData => ({
    _id: tournament._id,
    tourId: tournament.tourId,
    title: tournament.title,
    managerId: tournament.managerId,
    description: tournament.description,
    sport: tournament.sport,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    regDeadline: tournament.regDeadline,
    location: tournament.location,
    maxTeams: tournament.maxTeams,
    minTeams: tournament.minTeams,
    entryFee: tournament.entryFee,
    format: tournament.format,
    prizePool: tournament.prizePool,
    status: tournament.status
});
