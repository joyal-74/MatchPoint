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
    authProvider: string;
}

const inputClasses = `
  w-full p-3 rounded-lg border transition-all duration-200
  bg-neutral-900/60 text-neutral-100 border-neutral-700 placeholder-neutral-400
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const selectClasses = `${inputClasses} appearance-none bg-no-repeat bg-right pr-10 
  bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' 
  fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a1a1aa' 
  stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' 
  d='m6 8 4 4 4-4'/%3e%3c/svg%3e")] bg-[length:1.5rem_1.5rem] 
  bg-[center_right_0.75rem]`;

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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 text-neutral-100 rounded-2xl p-6 w-full max-w-md border border-neutral-700 shadow-2xl">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-1">Complete Registration</h2>
                    <p className="text-neutral-400 text-sm">
                        Please provide additional information to continue
                    </p>
                </div>

                {userDetails && (
                    <div className="mb-6 p-4 bg-neutral-800/70 rounded-xl border border-neutral-700">
                        <div className="flex items-center space-x-3">
                            {userDetails.picture && (
                                <img
                                    src={userDetails.picture}
                                    alt={userDetails.name}
                                    className="w-10 h-10 rounded-full border border-neutral-700"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm truncate">{userDetails.name}</p>
                                <p className="text-neutral-400 text-xs truncate">{userDetails.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            I am a <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={selectClasses}
                        >
                            <option value="player">Player</option>
                            <option value="viewer">Viewer</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    {/* Username & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Username <span className="text-red-500">*</span>
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
                            <label className="block text-sm font-semibold mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className={selectClasses}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Phone & Sport */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                maxLength={10}
                                className={inputClasses}
                                placeholder="9876543210"
                            />
                        </div>

                        {formData.role === 'player' && (
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Sport <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="sport"
                                    value={formData.sport}
                                    onChange={handleChange}
                                    required
                                    className={selectClasses}
                                >
                                    <option value="" disabled>Select Sport</option>
                                    <option value="Cricket">Cricket</option>

                                </select>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-neutral-400">
                        <span className="text-red-500">*</span> Required fields
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 text-sm font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50"
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