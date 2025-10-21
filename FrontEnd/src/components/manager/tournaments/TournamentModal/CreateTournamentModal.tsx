import { useState } from "react";
import { createTournament } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useAppDispatch } from "../../../../hooks/hooks";
import type { TournamentFormData, CreateTournamentModalProps } from "./types";
import { formats, initialFormData, sports } from "./constants";
import FormInput from "./FormInput";
import ModalHeader from "../../../shared/modal/ModalHeader";
import FormActions from "../../../shared/modal/FormActions";
import MapPicker from "../../../shared/MapPicker";
import { validateTournamentForm } from "../../../../validators/validateTournamentForm";


export default function CreateTournamentModal({
    isOpen,
    onClose,
    managerId,
    onShowPrizeInfo,
}: CreateTournamentModalProps) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<TournamentFormData>(initialFormData(managerId));
    const [rulesText, setRulesText] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            rules: rulesText.split("\n").map((r) => r.trim()).filter((r) => r),
        };

        const { isValid, errors: validationErrors } = validateTournamentForm(formattedData);
        setErrors(validationErrors);

        if (!isValid) return;

        dispatch(createTournament({ formData: formattedData, managerId }));
        handleClose();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "rules") {
            setRulesText(value);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]:
                name.includes("Teams") || name === "prizePool"
                    ? Number(value)
                    : value,
        }));
    };

    const handleClose = () => {
        setFormData(initialFormData(managerId));
        setRulesText("");
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const fields = [
        { label: "Tournament Name", type: "text", name: "title", placeholder: "Enter tournament name" },
        { label: "Sport", type: "select", name: "sport", options: sports },
        { label: "Tournament Start Date", type: "date", name: "startDate" },
        { label: "Tournament End Date", type: "date", name: "endDate" },
        { label: "Registration Deadline", type: "date", name: "regDeadline" },
        { label: "Max Participants", type: "number", name: "maxTeams", placeholder: "Maximum number of teams", min: "2" },
        { label: "Min Participants", type: "number", name: "minTeams", placeholder: "Minimum number of teams", min: "2" },
        { label: "Tournament Format", type: "select", name: "format", options: formats },
        { label: "Entry Fee", type: "number", name: "entryFee", placeholder: "Enter minimum entry fee", min: "0" },
        { label: "Players per Team", type: "number", name: "playersPerTeam", placeholder: "Enter number of players per team", min: "2" }
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
                                <div key={field.name}>
                                    <FormInput
                                        {...field}
                                        value={formData[field.name as keyof TournamentFormData]}
                                        onChange={handleChange}
                                    />
                                    {errors[field.name] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-end gap-2 mt-1">
                            <button
                                type="button"
                                onClick={onShowPrizeInfo}
                                className="text-xs text-center text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                💡 How prize pool is calculated?
                            </button>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Tournament Location
                            </label>
                            <MapPicker
                                onSelectLocation={(data) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        location: data.address,
                                        latitude: data.lat,
                                        longitude: data.lng,
                                    }));
                                }}
                            />
                            {formData.location && (
                                <p className="text-sm text-yellow-400 mt-1">
                                    {formData.location}
                                </p>
                            )}
                        </div>


                        <div className="mt-6">
                            <FormInput
                                label="Rules"
                                type="textarea"
                                name="rules"
                                value={rulesText}
                                onChange={handleChange}
                                placeholder="Rules about the tournament"
                                rows={3}
                            />
                        </div>

                        <p className="text-xs text-green-400 mt-1">
                            Enter each rule on a separate line. Each line will become an individual rule.
                        </p>

                        <div className="mt-6">
                            <FormInput
                                label="Description"
                                type="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description about the tournament"
                                rows={3}
                            />
                        </div>

                        <FormActions submitLabel="Create Tournament" onCancel={handleClose} />
                    </form>
                </div>
            </div>
        </div>
    );
}
