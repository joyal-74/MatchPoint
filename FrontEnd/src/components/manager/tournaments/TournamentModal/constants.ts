import type { Tournament } from "../../../../features/manager/managerTypes";
import type { TournamentFormData, updateTournamentFormData } from "./types";

export const sports = ["Cricket"];
export const formats = ["Knockout", "League", "Friendly"];

export const initialFormData = (managerId: string): TournamentFormData => ({
    title: "",
    managerId,
    description: "",
    sport: "",
    startDate: '',
    endDate: '',
    regDeadline: '',
    location: "",
    latitude: undefined,
    longitude: undefined,
    maxTeams: 0,
    minTeams: 0,
    currTeams: 0,
    entryFee: "",
    format: 'knockout',
    prizePool: 0,
    playersPerTeam: 0,
    rules: []
});

export const initialEditFormData = (managerId: string, id: string): updateTournamentFormData => ({
    _id: "",
    tourId: id,
    title: "",
    managerId,
    description: "",
    sport: "",
    startDate: "",
    regDeadline: "",
    endDate: "",
    location: "",
    latitude: undefined,
    longitude: undefined,
    maxTeams: 0,
    minTeams: 0,
    currTeams: 0,
    entryFee: "",
    format: 'knockout',
    prizePool: 0,
    playersPerTeam: 0,
    status: 'ongoing',
    rules: []
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
    latitude: tournament.latitude,
    longitude: tournament.longitude,
    maxTeams: tournament.maxTeams,
    minTeams: tournament.minTeams,
    currTeams: tournament.minTeams,
    entryFee: tournament.entryFee,
    format: tournament.format,
    prizePool: tournament.prizePool,
    playersPerTeam: tournament.playersPerTeam,
    status: tournament.status,
    rules: tournament.rules
});
