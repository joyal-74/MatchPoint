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
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [description, setDescription] = useState("");
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

        if (!name.trim() || !logo || !managerId) {
            alert('Please fill all required fields');
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
            formData.append("logo", logo);

            await onCreateTeam(formData);
            
            // Reset and close
            setName("");
            setSport("Cricket");
            setMaxPlayers(0);
            setDescription("");
            setLogo(null);
            setLogoPreview("");
            onClose();
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Failed to create team. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl z-50">
                <ModalHeader 
                    title="Create New Team" 
                    onClose={onClose}
                    disabled={isLoading}
                />

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                    <FormSelect
                        label="Sport"
                        value={sport}
                        onChange={setSport}
                        options={[{ value: "Cricket", label: "Cricket" }]}
                        disabled={isLoading}
                    />

                    <FormInput
                        label="Max Players"
                        type="number"
                        value={maxPlayers}
                        onChange={(value) => setMaxPlayers(Number(value))}
                        placeholder="Enter max players"
                        required
                        disabled={isLoading}
                        min={2}
                        max={50}
                    />

                    <FormTextarea
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="Describe your team, playing style, achievements..."
                        rows={3}
                        disabled={isLoading}
                    />

                    <FormActions
                        submitLabel="Create Team"
                        onCancel={onClose}
                        disabled={!logo}
                        loading={isLoading}
                    />
                </form>
            </div>
        </div>
    );
}