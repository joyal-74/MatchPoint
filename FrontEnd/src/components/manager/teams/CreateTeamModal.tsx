import { type FormEvent, useState } from "react";
import ModalBackdrop from "../../ui/ModalBackdrop";
import ModalHeader from "../../shared/modal/ModalHeader";
import LogoUpload from "./Modal/LogoUpload";
import FormInput from "./Modal/FormInput";
import FormSelect from "./Modal/FormSelect";
import FormActions from "../../shared/modal/FormActions";
import FormTextarea from "./Modal/FormTextarea";

export interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTeam: (teamData: FormData) => void;
    managerId: string;
}

export default function CreateTeamModal({
    isOpen,
    onClose,
    onCreateTeam,
    managerId,
}: CreateTeamModalProps) {
    const [name, setName] = useState("");
    const [sport, setSport] = useState("Cricket");
    const [maxPlayers, setMaxPlayers] = useState("");
    const [description, setDescription] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogoChange = (file: File) => {
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleLogoRemove = () => {
        setLogo(null);
        setLogoPreview("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim() || !logo || !managerId || !state.trim() || !city.trim()) {
            alert("Please fill all required fields");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("sport", sport);
            formData.append("maxPlayers", maxPlayers.toString());
            formData.append("managerId", managerId);
            formData.append("description", description);
            formData.append("state", state);
            formData.append("city", city);
            formData.append("logo", logo);

            await onCreateTeam(formData);

            // Reset fields
            setName("");
            setSport("Cricket");
            setMaxPlayers("");
            setDescription("");
            setState("");
            setCity("");
            setLogo(null);
            setLogoPreview("");
            onClose();
        } catch (error) {
            console.error("Error creating team:", error);
            alert("Failed to create team. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const stateOptions = [
        { value: "Kerala", label: "Kerala" },
        { value: "Tamil Nadu", label: "Tamil Nadu" },
        { value: "Karnataka", label: "Karnataka" },
        { value: "Maharashtra", label: "Maharashtra" },
        { value: "Delhi", label: "Delhi" },
        { value: "Gujarat", label: "Gujarat" },
        { value: "West Bengal", label: "West Bengal" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClick={onClose} />

            <div
                className="relative w-full max-w-2xl bg-neutral-900 rounded-xl 
                   border border-neutral-700 shadow-2xl z-50"
            >
                <ModalHeader title="Create New Team" onClose={onClose} disabled={isLoading} />

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Logo Upload - full width */}
                    <LogoUpload
                        logoPreview={logoPreview}
                        onLogoChange={handleLogoChange}
                        onLogoRemove={handleLogoRemove}
                        disabled={isLoading}
                    />

                    <FormInput
                        label="Team Name"
                        type="text"
                        value={name}
                        onChange={setName}
                        placeholder="Enter team name"
                        required
                        disabled={isLoading}
                    />

                    {/* Grid layout for form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormSelect
                            label="State"
                            value={state}
                            onChange={setState}
                            options={stateOptions}
                            placeholder="Select your state"
                            disabled={isLoading}
                        />

                        <FormInput
                            label="Region / City"
                            type="text"
                            value={city}
                            onChange={setCity}
                            placeholder="Enter your city or region"
                            required
                            disabled={isLoading}
                        />

                        <FormSelect
                            label="Sport"
                            value={sport}
                            onChange={setSport}
                            options={[{ value: "Cricket", label: "Cricket" }]}
                            placeholder="Select your sport"
                            disabled={isLoading}
                        />

                        <FormInput
                            label="Max Players"
                            type="number"
                            value={maxPlayers}
                            onChange={(value) => setMaxPlayers(value)}
                            placeholder="Enter max players"
                            required
                            disabled={isLoading}
                            min={2}
                            max={50}
                        />
                    </div>

                    {/* Description - full width */}
                    <FormTextarea
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="Describe your team, playing style, achievements..."
                        rows={3}
                        disabled={isLoading}
                    />

                    {/* Actions - full width */}
                    <FormActions
                        submitLabel="Create Team"
                        onCancel={onClose}
                        disabled={!logo || isLoading}
                        loading={isLoading}
                    />
                </form>
            </div>
        </div>
    );
}
