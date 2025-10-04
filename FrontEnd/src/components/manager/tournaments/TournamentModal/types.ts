import type { Formats, Tournament } from "../../../../features/manager/managerTypes";

export interface TournamentFormData {
    title: string;
    managerId: string;
    description: string;
    sport: string;
    startDate: Date;
    endDate: Date;
    regDeadline: Date;
    location: string;
    maxTeams: number;
    minTeams: number;
    entryFee: string;
    format: Formats;
    prizePool: number;
}

export interface CreateTournamentModalProps {
    isOpen: boolean;
    managerId: string;
    onClose: () => void;
}

export interface EditTournamentModalProps extends CreateTournamentModalProps {
    tournament: Tournament
}


export type Status = "upcoming" | "ongoing" | "ended"

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
    value?: string | number | Date;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    min?: string | number;
    options?: string[];
    rows?: number;
}