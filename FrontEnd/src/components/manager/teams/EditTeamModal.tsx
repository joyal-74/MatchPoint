import { type FormEvent, useState, useEffect } from "react";
import ModalBackdrop from "../../ui/ModalBackdrop";
import ModalHeader from "../../shared/modal/ModalHeader";
import LogoUpload from "./Modal/LogoUpload";
import FormInput from "./Modal/FormInput";
import FormSelect from "./Modal/FormSelect";
import FormActions from "../../shared/modal/FormActions";
import FormTextarea from "./Modal/FormTextarea";

export interface EditTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditTeam: (teamId: string, formData: FormData) => void;
    teamData: {
        teamId: string;
        updatedData: {
            name: string;
            sport: string;
            managerId: string;
            description?: string;
            logo?: string;
            maxPlayers?: string;
        };
    };
}

export default function EditTeamModal({
    isOpen,
    onClose,
    onEditTeam,
    teamData,
}: EditTeamModalProps) {
    const [name, setName] = useState("");
    const [sport, setSport] = useState("Cricket");
    const [description, setDescription] = useState("");
    const [maxPlayers, setMaxPlayers] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (teamData) {
            setName(teamData.updatedData.name);
            setSport(teamData.updatedData.sport);
            setDescription(teamData.updatedData.description || "");
            setMaxPlayers(teamData.updatedData.maxPlayers || '');

            if (teamData.updatedData.logo) {
                setLogoPreview(teamData.updatedData.logo);
            }
        }
    }, [teamData]);

    const handleLogoChange = (file: File) => {
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleLogoRemove = () => {
        setLogo(null);
        setLogoPreview(teamData.updatedData.logo || "");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('Please enter a team name');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();

            formData.append("name", name.trim());
            formData.append("sport", sport);
            formData.append("managerId", teamData.updatedData.managerId);
            formData.append("description", description);
            formData.append("maxPlayers", maxPlayers.toString());

            // Append logo only if a new file was selected
            if (logo) {
                formData.append("logo", logo);
            }

            await onEditTeam(teamData.teamId, formData);

            onClose();
        } catch (error) {
            console.error('Error updating team:', error);
            alert('Failed to update team. Please try again.');
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
                    title="Edit Team"
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

                    <FormInput
                        label="Max Players"
                        type="text"
                        value={maxPlayers}
                        onChange={setMaxPlayers}
                        placeholder="Enter Maximum player limit"
                        required
                        disabled={isLoading}
                    />

                    <FormSelect
                        label="Sport"
                        value={sport}
                        onChange={setSport}
                        options={[
                            { value: "Cricket", label: "Cricket" },
                            { value: "Football", label: "Football" },
                            { value: "Basketball", label: "Basketball" }
                        ]}
                        disabled={isLoading}
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
                        submitLabel="Update Team"
                        onCancel={onClose}
                        loading={isLoading}
                    />
                </form>
            </div>
        </div>
    );
}