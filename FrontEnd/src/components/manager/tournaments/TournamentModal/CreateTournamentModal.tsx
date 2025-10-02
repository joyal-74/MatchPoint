import { useState } from "react";
import { createTournament } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useAppDispatch } from "../../../../hooks/hooks";
import type { TournamentFormData, CreateTournamentModalProps } from "./types";
import { formats, initialFormData, sports } from "./constants";
import FormInput from "./FormInput";
import ModalHeader from "../../../shared/modal/ModalHeader";
import FormActions from "../../../shared/modal/FormActions";

export default function CreateTournamentModal({ isOpen, onClose, managerId }: CreateTournamentModalProps) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<TournamentFormData>(initialFormData(managerId));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createTournament(formData));
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes("Teams") || name === "prizePool" ? Number(value) : value
        }));
    };

    const handleClose = () => {
        setFormData(initialFormData(managerId));
        onClose();
    };

    if (!isOpen) return null;

    const fields = [
        { label: "Tournament Name", type: "text", name: "name", placeholder: "Enter tournament name" },
        { label: "Sport", type: "select", name: "sport", options: sports },
        { label: "Tournament Start Date", type: "date", name: "startDate" },
        { label: "Registration Deadline", type: "date", name: "endDate" },
        { label: "Location", type: "text", name: "location", placeholder: "Enter tournament location" },
        { label: "Tournament Format", type: "select", name: "format", options: formats },
        { label: "Max Participants", type: "number", name: "maxTeams", placeholder: "Maximum number of teams", min: "2" },
        { label: "Min Participants", type: "number", name: "minTeams", placeholder: "Minimum number of teams", min: "2" },
        { label: "Entry Fee", type: "number", name: "entryFee", placeholder: "Enter minimum entry fee", min: "0" },
        { label: "Prize Pool", type: "number", name: "prizePool", placeholder: "Enter your prize pool", min: "0" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl">
                    <ModalHeader title="Create New Tournament" onClose={handleClose} />

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {fields.map((field) => (
                                <FormInput
                                    key={field.name}
                                    {...field}
                                    value={formData[field.name as keyof TournamentFormData]}
                                    onChange={handleChange}
                                    required
                                />
                            ))}
                        </div>

                        <div className="mt-6">
                            <FormInput
                                label="Description"
                                type="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description about the tournament"
                                rows={3}
                                required
                            />
                        </div>

                        <FormActions submitLabel="Create Tournament" onCancel={handleClose} />
                    </form>
                </div>
            </div>
        </div>
    );
}