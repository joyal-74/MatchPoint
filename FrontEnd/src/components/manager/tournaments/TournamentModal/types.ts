import type { Formats, Tournament } from "../../../../features/manager/managerTypes";

export interface TournamentFormData {
    title: string;
    managerId: string;
    description: string;
    sport: string;
    startDate: string;
    endDate: string;
    regDeadline: string;
    location: string;
    latitude?: number;
    longitude?: number;
    maxTeams: number;
    minTeams: number;
    currTeams: number;
    entryFee: string;
    format: Formats;
    prizePool: number;
    playersPerTeam: number;
    rules: string[];
    umpireId: string;
    banner: File | string | undefined;
    overs?: number;
}


export interface CreateTournamentModalProps {
    isOpen: boolean;
    managerId: string;
    onClose: () => void;
    onShowPrizeInfo : () => void;
}

export interface EditTournamentModalProps extends CreateTournamentModalProps {
    tournament: Tournament
}


export type Status = "upcoming" | "ongoing" | "completed"

export interface updateTournamentFormData extends TournamentFormData {
    _id: string;
    tourId: string;
    status: Status;
}

export interface FormInputProps {
    label: string;
    icon?: React.ReactNode;
    type: string;
    name: string;
    value?: string | number | Date | string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    min?: string | number;
    options?: string[];
    rows?: number;
}