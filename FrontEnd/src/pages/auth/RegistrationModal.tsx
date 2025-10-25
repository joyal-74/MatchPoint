import { useState, useEffect } from 'react';
import { decodeJWT } from '../../utils/jwtDecoder';
import type { Gender, SignupRole } from '../../types/UserRoles';
import type { CompleteUserData } from '../../types/api/UserApi';

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
}



const inputClasses = `
    w-full p-3 rounded-lg border transition-all duration-200
    bg-[var(--color-surface)] text-[var(--color-text-primary)]
    border-[var(--color-border)] placeholder-[var(--color-text-tertiary)]
    focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)]
    disabled:opacity-50 disabled:cursor-not-allowed
    backdrop-blur-sm
`;

const selectClasses = `${inputClasses} appearance-none bg-no-repeat bg-right pr-10 bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")] bg-[length:1.5rem_1.5rem] bg-[center_right_0.75rem]`;

const RegistrationModal: React.FC<RegistrationModalProps> = ({
    tempToken,
    isOpen,
    onClose,
    onSubmit,
    loading = false
}) => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [formData, setFormData] = useState<CompleteUserData>({
        tempToken: '',
        role: 'viewer' as SignupRole,
        gender: 'male' as Gender,
        sport: '',
        username: '',
        phone: ''
    });

    useEffect(() => {
        if (tempToken && isOpen) {
            const decoded = decodeJWT<UserDetails>(tempToken);
            if (decoded) {
                setUserDetails(decoded);
                const defaultUsername = decoded.email.split('@')[0];
                setFormData(prev => ({
                    ...prev,
                    tempToken,
                    username: defaultUsername
                }));
            }
        }
    }, [tempToken, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const roleValue = value as SignupRole;
        if (roleValue !== 'player') {
            setFormData(prev => ({
                ...prev,
                role: roleValue,
                sport: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-[var(--color-background-overlay)] flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-surface)] backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Complete Registration</h2>
                    <p className="text-[var(--color-text-secondary)] text-sm">Please provide additional information to continue</p>
                </div>

                {userDetails && (
                    <div className="mb-6 p-4 bg-[var(--color-surface-secondary)] rounded-xl border border-[var(--color-border-secondary)]">
                        <div className="flex items-center space-x-3">
                            {userDetails.picture && (
                                <img
                                    src={userDetails.picture}
                                    alt={userDetails.name}
                                    className="w-10 h-10 rounded-full border border-[var(--color-border)]"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-[var(--color-text-primary)] text-sm truncate">{userDetails.name}</p>
                                <p className="text-[var(--color-text-tertiary)] text-xs truncate">{userDetails.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                            I am a <span className="text-[var(--color-error)]">*</span>
                        </label>
                        <select name="role" value={formData.role} onChange={handleChange} required className={selectClasses}>
                            <option value="player">Player</option>
                            <option value="viewer">Viewer</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    {/* Username & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                                Username <span className="text-[var(--color-error)]">*</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Choose username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                                Gender <span className="text-[var(--color-error)]">*</span>
                            </label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required className={selectClasses}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Phone & Conditional Sport */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        {formData.role === 'player' && (
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                                    Sport <span className="text-[var(--color-error)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="sport"
                                    value={formData.sport}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="e.g., Football"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-[var(--color-text-tertiary)]">
                        <span className="text-[var(--color-error)]">*</span> Required fields
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-surface)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
                        >
                            {loading ? (
                                <span className="flex items-center space-x-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Completing...</span>
                                </span>
                            ) : (
                                'Complete Registration'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;