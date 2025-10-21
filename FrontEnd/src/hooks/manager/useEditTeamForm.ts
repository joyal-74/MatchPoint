import { useReducer, useEffect } from "react";

interface TeamData {
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
}

interface FormState {
    name: string;
    sport: string;
    maxPlayers: string;
    description: string;
    state: string;
    city: string;
    logo: File | null;
    logoPreview: string;
    isLoading: boolean;
    errors: Record<string, string>;
}

type FormAction =
    | { type: 'SET_FIELD'; field: string; value: any }
    | { type: 'SET_LOGO'; file: File; preview: string }
    | { type: 'REMOVE_LOGO' }
    | { type: 'SET_ERROR'; field: string; error: string }
    | { type: 'CLEAR_ERRORS' }
    | { type: 'SET_LOADING'; loading: boolean }
    | { type: 'RESET_FORM'; payload?: Partial<FormState> };

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: "" } };
        case 'SET_LOGO':
            return { ...state, logo: action.file, logoPreview: action.preview, errors: { ...state.errors, logo: "" } };
        case 'REMOVE_LOGO':
            return { ...state, logo: null, logoPreview: "", errors: { ...state.errors, logo: "" } };
        case 'SET_ERROR':
            return { ...state, errors: { ...state.errors, [action.field]: action.error } };
        case 'CLEAR_ERRORS':
            return { ...state, errors: {} };
        case 'SET_LOADING':
            return { ...state, isLoading: action.loading };
        case 'RESET_FORM':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

// Single source of truth for validation
const getFieldValidation = (fieldName: string, value: string): string => {
    const validations: Record<string, (val: string) => string> = {
        name: (val: string) => {
            if (!val.trim()) return "Team name is required.";
            if (val.trim().length < 3) return "Team name must be at least 3 characters long.";
            return "";
        },
        state: (val: string) => !val.trim() ? "Please select your state." : "",
        city: (val: string) => !val.trim() ? "City or region is required." : "",
        maxPlayers: (val: string) => {
            if (!val) return "Max players is required.";
            const num = Number(val);
            if (isNaN(num) || num < 2 || num > 50) return "Max players must be between 2 and 50.";
            return "";
        }
    };
    
    return validations[fieldName] ? validations[fieldName](value) : "";
};

export function useEditTeamForm(teamData: TeamData, onEditTeam: (teamId: string, formData: FormData) => void) {
    const initialState: FormState = {
        name: teamData.updatedData.name,
        sport: teamData.updatedData.sport || "Cricket",
        maxPlayers: teamData.updatedData.maxPlayers || "",
        description: teamData.updatedData.description || "",
        state: teamData.updatedData.state || "",
        city: teamData.updatedData.city || "",
        logo: null,
        logoPreview: teamData.updatedData.logo || "",
        isLoading: false,
        errors: {}
    };

    const [state, dispatch] = useReducer(formReducer, initialState);

    // Update state when teamData changes
    useEffect(() => {
        dispatch({
            type: 'RESET_FORM', 
            payload: {
                name: teamData.updatedData.name,
                sport: teamData.updatedData.sport || "Cricket",
                maxPlayers: teamData.updatedData.maxPlayers || "",
                description: teamData.updatedData.description || "",
                state: teamData.updatedData.state || "",
                city: teamData.updatedData.city || "",
                logo: null,
                logoPreview: teamData.updatedData.logo || "",
            }
        });
    }, [teamData]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // For edit, logo is optional - only validate if completely missing
        if (!state.logo && !state.logoPreview) {
            newErrors.logo = "Team logo is required.";
        }

        // Use shared validation functions
        newErrors.name = getFieldValidation('name', state.name);
        newErrors.state = getFieldValidation('state', state.state);
        newErrors.city = getFieldValidation('city', state.city);
        newErrors.maxPlayers = getFieldValidation('maxPlayers', state.maxPlayers);

        // Filter out empty errors
        return Object.fromEntries(Object.entries(newErrors).filter(([_, error]) => error !== ""));
    };

    const handleFieldChange = (field: string, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value });
        
        // Real-time validation
        if (typeof value === 'string') {
            const error = getFieldValidation(field, value);
            if (error) {
                dispatch({ type: 'SET_ERROR', field, error });
            }
        }
    };

    const handleLogoChange = (file: File) => {
        dispatch({ type: 'SET_LOGO', file, preview: URL.createObjectURL(file) });
    };

    const handleLogoRemove = () => {
        dispatch({ type: 'REMOVE_LOGO' });

        if (teamData.updatedData.logo) {
            dispatch({ type: 'SET_FIELD', field: 'logoPreview', value: teamData.updatedData.logo });
        }
    };

    const handleClose = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const validationErrors = validateForm();

        Object.entries(validationErrors).forEach(([field, error]) => {
            dispatch({ type: 'SET_ERROR', field, error });
        });

        if (Object.keys(validationErrors).length > 0) return false;

        dispatch({ type: 'SET_LOADING', loading: true });

        try {
            const formData = new FormData();
            formData.append("name", state.name.trim());
            formData.append("sport", state.sport);
            formData.append("maxPlayers", state.maxPlayers.toString());
            formData.append("managerId", teamData.updatedData.managerId);
            formData.append("description", state.description);
            formData.append("state", state.state);
            formData.append("city", state.city);
            if (state.logo) formData.append("logo", state.logo);

            await onEditTeam(teamData.teamId, formData);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', loading: false });
        }
    };

    return {
        state,
        handleFieldChange,
        handleLogoChange,
        handleLogoRemove,
        handleClose,
        handleSubmit
    };
}