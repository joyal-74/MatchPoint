import ModalBackdrop from "../../ui/ModalBackdrop";
import ModalHeader from "../../shared/modal/ModalHeader";
import LogoUpload from "./Modal/LogoUpload";
import FormInput, { type FormInputType } from "./Modal/FormInput";
import FormSelect from "./Modal/FormSelect";
import FormActions from "../../shared/modal/FormActions";
import FormTextarea from "./Modal/FormTextarea";
import { stateOptions } from "../../../utils/helpers/stateOptions";
import { useEditTeamForm } from "../../../hooks/manager/useEditTeamForm";
import type { FormEvent } from "react";

export interface EditTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditTeam: (teamId: string, formData: FormData) => void;
    teamData: {
        teamId: string;
        updatedData: {
            name: string;
            sport: string;
            state: string;
            city: string;
            managerId: string;
            description?: string;
            logo?: string;
            maxPlayers?: string;
        };
    };
}

export default function EditTeamModal({ isOpen, onClose, onEditTeam, teamData }: EditTeamModalProps) {
    const { state, handleFieldChange, handleLogoChange, handleLogoRemove, handleClose, handleSubmit } = useEditTeamForm(teamData, onEditTeam);

    const closeModal = () => {
        handleClose();
        onClose();
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        handleSubmit(e).then(success => {
            if (success) {
                onClose();
            }
        });
    };

    const formFields = [
        {
            type: "input" as const,
            name: "name",
            label: "Team Name",
            value: state.name,
            onChange: (val: string) => handleFieldChange('name', val),
            placeholder: "Enter team name"
        },
        {
            type: "select" as const,
            name: "state",
            label: "State",
            value: state.state,
            onChange: (val: string) => handleFieldChange('state', val),
            options: stateOptions,
            placeholder: "Select your state"
        },
        {
            type: "input" as const,
            name: "city",
            label: "Region / City",
            value: state.city,
            onChange: (val: string) => handleFieldChange('city', val),
            placeholder: "Enter your city or region"
        },
        {
            type: "select" as const,
            name: "sport",
            label: "Sport",
            value: state.sport,
            onChange: (val: string) => handleFieldChange('sport', val),
            options: [{ value: "Cricket", label: "Cricket" }],
            placeholder: "Select your sport"
        },
        {
            type: "input" as const,
            name: "maxPlayers",
            label: "Max Players",
            value: state.maxPlayers,
            onChange: (val: string) => handleFieldChange('maxPlayers', val),
            placeholder: "Enter max players",
            props: { type: "number", min: 2, max: 50 }
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClick={closeModal} />

            {/* Modal Container with Semantic Theming */}
            <div className="relative w-full max-w-2xl bg-card text-card-foreground rounded-xl border border-border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <ModalHeader
                    title="Edit Team"
                    onClose={closeModal}
                    disabled={state.isLoading}
                />

                <form onSubmit={onSubmit} className="p-6 space-y-6">

                    {/* Logo Section */}
                    <div className="space-y-2">
                        <LogoUpload
                            logoPreview={state.logoPreview}
                            onLogoChange={handleLogoChange}
                            onLogoRemove={handleLogoRemove}
                            disabled={state.isLoading}
                        />
                        {state.errors.logo && (
                            <p className="text-destructive text-xs mt-1 animate-pulse">
                                {state.errors.logo}
                            </p>
                        )}
                    </div>

                    {/* Name Input */}
                    <div className="space-y-1">
                        <FormInput
                            label="Team Name"
                            type="text"
                            value={state.name}
                            onChange={(val) => handleFieldChange('name', val)}
                            placeholder="Enter team name"
                            disabled={state.isLoading}
                        />
                        {state.errors.name && (
                            <p className="text-destructive text-xs mt-1">
                                {state.errors.name}
                            </p>
                        )}
                    </div>

                    {/* Dynamic Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formFields.slice(1).map((field) => (
                            <div key={field.name} className="space-y-1">
                                {field.type === "input" ? (
                                    <FormInput
                                    {...field.props}
                                        label={field.label}
                                        type={field.props?.type as FormInputType}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder={field.placeholder}
                                        disabled={state.isLoading}
                                    />
                                ) : (
                                    <FormSelect
                                        label={field.label}
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={field.options || []}
                                        placeholder={field.placeholder}
                                        disabled={state.isLoading}
                                    />
                                )}
                                {state.errors[field.name] && (
                                    <p className="text-destructive text-xs mt-1">
                                        {state.errors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-1">
                        <FormTextarea
                            label="Description"
                            value={state.description}
                            onChange={(val) => handleFieldChange('description', val)}
                            placeholder="Describe your team, playing style, achievements..."
                            rows={3}
                            disabled={state.isLoading}
                        />
                    </div>

                    <div className="pt-2 border-t border-border">
                        <FormActions
                            submitLabel="Update Team"
                            onCancel={closeModal}
                            disabled={state.isLoading}
                            loading={state.isLoading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}