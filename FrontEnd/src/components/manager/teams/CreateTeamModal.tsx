import ModalBackdrop from "../../ui/ModalBackdrop";
import ModalHeader from "../../shared/modal/ModalHeader";
import LogoUpload from "./Modal/LogoUpload";
import FormInput from "./Modal/FormInput";
import FormSelect from "./Modal/FormSelect";
import FormActions from "../../shared/modal/FormActions";
import FormTextarea from "./Modal/FormTextarea";
import { stateOptions } from "../../../utils/helpers/stateOptions";
import { useCreateTeamForm } from "../../../hooks/manager/useCreateTeamForm";

export interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTeam: (teamData: FormData) => void;
    managerId: string;
}


export default function CreateTeamModal({ isOpen, onClose, onCreateTeam, managerId }: CreateTeamModalProps) {
    const { state, dispatch, handleSubmit, handleClose } = useCreateTeamForm(managerId, onCreateTeam);

    const closeModal = () => {
        handleClose();
        onClose();
    };

    const formFields = [
        {
            type: "input",
            name: "name",
            label: "Team Name",
            value: state.name,
            onChange: (val: string) => dispatch({ type: 'SET_FIELD', field: 'name', value: val }),
            placeholder: "Enter team name",
            validation: (value: string) => {
                if (!value.trim()) return "Team name is required.";
                if (value.trim().length < 3) return "Team name must be at least 3 characters long.";
                return "";
            }
        },
        {
            type: "select",
            name: "state",
            label: "State",
            value: state.state,
            onChange: (val: string) => dispatch({ type: 'SET_FIELD', field: 'state', value: val }),
            options: stateOptions,
            placeholder: "Select your state",
            validation: (value: string) => !value.trim() ? "Please select your state." : ""
        },
        {
            type: "input",
            name: "city",
            label: "Region / City",
            value: state.city,
            onChange: (val: string) => dispatch({ type: 'SET_FIELD', field: 'city', value: val }),
            placeholder: "Enter your city or region",
            validation: (value: string) => !value.trim() ? "City or region is required." : ""
        },
        {
            type: "select",
            name: "sport",
            label: "Sport",
            value: state.sport,
            onChange: (val: string) => dispatch({ type: 'SET_FIELD', field: 'sport', value: val }),
            options: [{ value: "Cricket", label: "Cricket" }],
            placeholder: "Select your sport"
        },
        {
            type: "input",
            name: "maxPlayers",
            label: "Max Players",
            value: state.maxPlayers,
            onChange: (val: string) => dispatch({ type: 'SET_FIELD', field: 'maxPlayers', value: val }),
            placeholder: "Enter max players",
            validation: (value: string) => {
                if (!value) return "Max players is required.";
                const num = Number(value);
                if (isNaN(num) || num < 2 || num > 50) return "Max players must be between 2 and 50.";
                return "";
            },
            props: { type: "number", min: 2, max: 50 }
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClick={closeModal} />

            <div className="relative w-full max-w-2xl bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl z-50">
                <ModalHeader title="Create New Team" onClose={closeModal} disabled={state.isLoading} />

                <form onSubmit={(e) => handleSubmit(e)} className="p-6 space-y-4">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <LogoUpload
                            logoPreview={state.logoPreview}
                            onLogoChange={(file) => {
                                dispatch({
                                    type: 'SET_LOGO',
                                    file,
                                    preview: URL.createObjectURL(file)
                                });
                            }}
                            onLogoRemove={() => dispatch({ type: 'REMOVE_LOGO' })}
                            disabled={state.isLoading}
                        />
                        {state.errors.logo && <p className="text-red-500 text-xs mt-1">{state.errors.logo}</p>}
                    </div>

                    {/* Render form fields using loop */}
                    <div className="space-y-4">
                        {formFields.slice(0, 1).map((field) => (
                            <div key={field.name} className="space-y-1">
                                {field.type === "input" ? (
                                    <FormInput
                                        label={field.label}
                                        type={field.props?.type || "text"}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder={field.placeholder}
                                        disabled={state.isLoading}
                                        {...field.props}
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
                                    <p className="text-red-500 text-xs mt-1">{state.errors[field.name]}</p>
                                )}
                            </div>
                        ))}

                        {/* Grid fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formFields.slice(1).map((field) => (
                                <div key={field.name} className="space-y-1">
                                    {field.type === "input" ? (
                                        <FormInput
                                            label={field.label}
                                            type={field.props?.type}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={field.placeholder}
                                            disabled={state.isLoading}
                                            {...field.props}
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
                                        <p className="text-red-500 text-xs mt-1">{state.errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <FormTextarea
                            label="Description"
                            value={state.description}
                            onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'description', value: val })}
                            placeholder="Describe your team, playing style, achievements..."
                            rows={3}
                            disabled={state.isLoading}
                        />
                    </div>

                    <FormActions
                        submitLabel="Create Team"
                        onCancel={closeModal}
                        disabled={state.isLoading}
                        loading={state.isLoading}
                    />
                </form>
            </div>
        </div>
    );
}