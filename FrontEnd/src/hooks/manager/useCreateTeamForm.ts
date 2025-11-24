import { useReducer } from "react";

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
    | { type: 'RESET_FORM' };

const initialState: FormState = {
    name: "",
    sport: "Cricket",
    maxPlayers: "",
    description: "",
    state: "",
    city: "",
    logo: null,
    logoPreview: "",
    isLoading: false,
    errors: {}
};

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
            return { ...initialState };
        default:
            return state;
    }
}

export function useCreateTeamForm(managerId: string, onCreateTeam: (formData: FormData) => void) {
    const [state, dispatch] = useReducer(formReducer, initialState);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!state.logo) newErrors.logo = "Team logo is required.";

        if (!state.name.trim()) newErrors.name = "Team name is required.";
        else if (state.name.trim().length < 3) newErrors.name = "Team name must be at least 3 characters.";

        if (!state.state.trim()) newErrors.state = "Please select your state.";
        if (!state.city.trim()) newErrors.city = "City or region is required.";

        if (!state.maxPlayers) newErrors.maxPlayers = "Max players is required.";
        else if (isNaN(Number(state.maxPlayers)) || Number(state.maxPlayers) < 2 || Number(state.maxPlayers) > 50)
            newErrors.maxPlayers = "Max players must be between 2 and 50.";

        return newErrors;
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
            formData.append("managerId", managerId);
            formData.append("description", state.description);
            formData.append("state", state.state);
            formData.append("city", state.city);
            formData.append("logo", state.logo!);

            await onCreateTeam(formData);
            dispatch({ type: 'RESET_FORM' });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', loading: false });
        }
    };

    const handleClose = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    };

    return { state, dispatch, handleSubmit, handleClose };
}