import type { Tournament } from "../../../../features/manager/managerTypes";
import type { TournamentFormData, updateTournamentFormData } from "./types";

export const sports = ["Cricket"];
export const formats = ["Knockout", "League", "Friendly"];

export const initialFormData = (managerId: string): TournamentFormData => ({
    name: "",
    managerId,
    description: "",
    sport: "",
    startDate: "",
    endDate: "",
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
    name: "",
    managerId,
    description: "",
    sport: "",
    startDate: "",
    endDate: "",
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
    name: tournament.name,
    managerId: tournament.managerId,
    description: tournament.description,
    sport: tournament.sport,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    location: tournament.location,
    maxTeams: tournament.maxTeams,
    minTeams: tournament.minTeams,
    entryFee: tournament.entryFee,
    format: tournament.format,
    prizePool: tournament.prizePool,
    status: tournament.status
});
