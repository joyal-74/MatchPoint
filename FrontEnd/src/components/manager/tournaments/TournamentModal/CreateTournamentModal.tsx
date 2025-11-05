import { useState } from "react";
import { createTournament } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useAppDispatch } from "../../../../hooks/hooks";
import type { TournamentFormData, CreateTournamentModalProps } from "./types";
import { formats, initialFormData, sports } from "./constants";
import FormInput from "./FormInput";
import ModalHeader from "../../../shared/modal/ModalHeader";
import FormActions from "../../../shared/modal/FormActions";
import MapPicker from "../../../shared/MapPicker";
import { validateTournamentForm } from "../../../../validators/ValidateTournamentForm";

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

        const fd = new FormData();
        fd.append("managerId", managerId);
        fd.append("title", formattedData.title);
        fd.append("sport", formattedData.sport);
        fd.append("description", formattedData.description);
        fd.append("startDate", new Date(formattedData.startDate).toISOString());
        fd.append("endDate", new Date(formattedData.endDate).toISOString());
        fd.append("regDeadline", new Date(formattedData.regDeadline).toISOString());
        fd.append("location", formattedData.location);
        fd.append("latitude", String(formattedData.latitude ?? ""));
        fd.append("longitude", String(formattedData.longitude ?? ""));
        fd.append("maxTeams", String(formattedData.maxTeams));
        fd.append("minTeams", String(formattedData.minTeams));
        fd.append("entryFee", String(formattedData.entryFee));
        fd.append("format", formattedData.format);
        fd.append("prizePool", String(formattedData.prizePool));
        fd.append("playersPerTeam", String(formattedData.playersPerTeam));

        formattedData.rules.forEach((rule, i) => {
            fd.append(`rules[${i}]`, rule);
        });

        if (formattedData.banner instanceof File) {
            fd.append("banner", formattedData.banner);
        }

        dispatch(createTournament(fd))
            .unwrap()
            .then(() => handleClose())
            .catch((err) => console.log("Error in tournament creation", err));
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
                (name.includes("Teams") || name === "prizePool" || name === "entryFee" || name === "playersPerTeam")
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
    ] as const;

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
                                        value={formData[field.name as keyof TournamentFormData] as string | number}
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
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tournament Banner
                            </label>

                            <div className="flex flex-col items-center gap-3 border border-neutral-600 rounded-xl p-4 bg-neutral-800/60">

                                {/* Preview or Upload Box */}
                                {!formData.banner ? (
                                    <label className="w-full cursor-pointer">
                                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-500 rounded-xl hover:border-neutral-300 transition">
                                            <span className="text-gray-300 text-sm mb-2">Click to upload banner</span>
                                            <span className="text-neutral-400 text-xs">Supported formats: JPG, PNG, WEBP</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || undefined;
                                                setFormData((prev) => ({ ...prev, banner: file }));
                                            }}
                                        />
                                    </label>
                                ) : (
                                    <div className="relative w-full">
                                        <img
                                            src={URL.createObjectURL(formData.banner as Blob)}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-neutral-600"
                                        />

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, banner: undefined }))}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                {/* Change Image Button */}
                                {formData.banner && (
                                    <label className="text-blue-400 text-sm cursor-pointer hover:underline">
                                        Change Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || undefined;
                                                setFormData(prev => ({ ...prev, banner: file }));
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
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