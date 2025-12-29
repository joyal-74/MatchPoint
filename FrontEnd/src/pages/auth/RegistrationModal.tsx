import { useState, useEffect } from 'react';
import { decodeJWT } from '../../utils/jwtDecoder';
import type { Gender, SignupRole } from '../../types/UserRoles';
import type { CompleteUserData } from '../../types/api/UserApi';
import FormField from '../../components/shared/FormField';

interface UserDetails {
    email: string;
    name: string;
    picture: string;
    iat?: number;
    exp?: number;
}

interface RegistrationModalProps {
    tempToken: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: CompleteUserData) => void;
    loading?: boolean;
    authProvider: string;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
    tempToken,
    isOpen,
    onClose,
    onSubmit,
    loading = false,
    authProvider
}) => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [formData, setFormData] = useState<CompleteUserData>({
        tempToken: '',
        role: 'viewer' as SignupRole,
        gender: 'male' as Gender,
        sport: '',
        username: '',
        phone: '',
        authProvider: authProvider
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            authProvider: authProvider
        }));
    }, [authProvider]);

    useEffect(() => {
        if (tempToken) {
            const decoded = decodeJWT<UserDetails>(tempToken);
            if (decoded) {
                setUserDetails(decoded);
                const defaultUsername = decoded.email.split('@')[0];
                setFormData(prev => ({
                    ...prev,
                    tempToken,
                    username: defaultUsername,
                }));
            }
        }
    }, [tempToken]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'role') {
            const roleValue = value as SignupRole;
            setFormData(prev => ({
                ...prev,
                role: roleValue,
                sport: roleValue === 'player' ? prev.sport : '',
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md p-6 rounded-xl shadow-2xl bg-card border border-border animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Complete Registration</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Please provide a few more details to continue
                    </p>
                </div>

                {/* User Profile Preview */}
                {userDetails && (
                    <div className="mb-6 p-3 rounded-lg border border-border bg-muted/40 flex items-center gap-3">
                        {userDetails.picture ? (
                            <img
                                src={userDetails.picture}
                                alt={userDetails.name}
                                className="w-10 h-10 rounded-full border border-border"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {userDetails.name.charAt(0)}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground truncate">{userDetails.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{userDetails.email}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Role Selector */}
                    {/* We use a manual Select here to handle value vs label casing specifically */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="role" className="text-sm font-medium text-foreground">
                            I am a <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="player">Player</option>
                                <option value="viewer">Viewer</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                    </div>

                    {/* Username & Gender Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            id="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="username"
                        />
                        
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium text-foreground">
                                Gender <span className="text-destructive">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Phone & Sport Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            id="phone"
                            label="Phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            // Adding pattern validation logic to onChange via FormField isn't direct, 
                            // so we rely on standard html attributes passed down
                        />

                        {formData.role === 'player' && (
                             <div className="flex flex-col space-y-2">
                                <label htmlFor="sport" className="text-sm font-medium text-foreground">
                                    Sport <span className="text-destructive">*</span>
                                </label>
                                <select
                                    id="sport"
                                    name="sport"
                                    value={formData.sport}
                                    onChange={handleChange}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                                >
                                    <option value="" disabled>Select Sport</option>
                                    <option value="Cricket">Cricket</option>
                                    <option value="Football">Football</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        <span className="text-destructive">*</span> Required fields
                    </p>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-primary-foreground rounded-md bg-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                            Complete Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;