import { useState, useEffect } from "react";
import { verifyCurrentPassword, updatePassword, updatePrivacySettings, } from "../../features/shared/settings/settingsThunk";
import {
    Save, Lock, Globe, Eye, EyeOff, ShieldCheck,
    Settings, AlertCircle, CheckCircle2, ChevronDown, Loader2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { invalidatePasswordVerification, resetSettingsState } from "../../features/shared/settings/settingsSlice";



const LANGUAGES = [{ code: "en", name: "English (US)" }, { code: "en-gb", name: "English (UK)" }, { code: "es", name: "Spanish" }, { code: "fr", name: "French" }, { code: "de", name: "German" }, { code: "hi", name: "Hindi" }];
const COUNTRIES = [{ code: "US", name: "United States" }, { code: "IN", name: "India" }, { code: "UK", name: "United Kingdom" }, { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" }, { code: "AE", name: "United Arab Emirates" }];
const THEMES = [{ id: 'emerald', hex: '#10b981', label: 'Default' }, { id: 'violet', hex: '#8b5cf6', label: 'Violet' }, { id: 'blue', hex: '#3b82f6', label: 'Royal' }, { id: 'rose', hex: '#f43f5e', label: 'Crimson' }, { id: 'amber', hex: '#f59e0b', label: 'Gold' }];

const calculateStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;
    return score;
};

const getThemeStyles = (accentColor: string) => {
    const theme = THEMES.find(t => t.id === accentColor) || THEMES[0];
    return {
        '--accent': theme.hex,
        '--accent-light': `${theme.hex}40`,
        '--accent-subtle': `${theme.hex}20`,
    } as React.CSSProperties;
};

export default function SettingsPage() {
    const dispatch = useAppDispatch();

    // Select state from Redux
    const {
        isLoading,
        isVerifying,
        isPasswordVerified,
        error: reduxError,
        successMessage
    } = useAppSelector((state) => state.settings);

    const userId = useAppSelector(state => state.auth.user?._id)

    const [expandedSection, setExpandedSection] = useState<string | null>('security');

    // -- State: Security --
    const [security, setSecurity] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        current: false, new: false, confirm: false,
    });

    // -- State: Preferences --
    const [preferences, setPreferences] = useState({
        language: "en",
        country: "IN",
    });

    const accentColor = 'emerald';
    const themeStyles = getThemeStyles(accentColor);

    // Cleanup on unmount
    useEffect(() => {
        return () => { dispatch(resetSettingsState()); }
    }, [dispatch]);

    // -- Handlers --
    const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSecurity({ ...security, [name]: value });

        if (name === 'currentPassword') {
            dispatch(invalidatePasswordVerification());
        }
    };

    // THE LOGIC: Trigger verification on Blur
    const handleCurrentPasswordBlur = () => {
        if (security.currentPassword.length > 0 && userId) {
            dispatch(verifyCurrentPassword({ userId, password: security.currentPassword }));
        }
    };

    const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const toggleVisibility = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const toggleSection = (section: string) => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Handle Password Update
        if (expandedSection === 'security' && userId) {
            if (!isPasswordVerified) return; // Guard clause

            if (security.newPassword !== security.confirmPassword) {
                // You can dispatch a local error action here if you want
                alert("New passwords do not match.");
                return;
            }

            dispatch(updatePassword({
                userId,
                currentPassword: security.currentPassword,
                newPassword: security.newPassword
            })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }
            });
        }
        // 2. Handle Privacy/Preferences Update
        else if (expandedSection === 'preferences' && userId) {
            dispatch(updatePrivacySettings({ userId, language: preferences.language, country: preferences.country }));
        }
    };

    return (
        <div className="text-white p-4 md:p-8" style={themeStyles}>
            <div className="mx-auto space-y-6">

                {/* --- Page Header --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Settings className="text-emerald-500" size={32} />
                            Settings
                        </h1>
                        <p className="text-neutral-400 mt-1">
                            Manage your account security and localization preferences.
                        </p>
                    </div>

                    {/* Global Messages */}
                    {(successMessage || reduxError) && (
                        <div className={`
                                px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2
                                ${successMessage
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'}
                            `}>
                            {successMessage ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {successMessage || reduxError}
                        </div>
                    )}
                </header>

                <form onSubmit={handleSave} className="space-y-6">

                    {/* --- REGIONAL SETTINGS SECTION (Kept same as original, added 'name' props) --- */}
                    <section className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                        <button
                            type="button"
                            onClick={() => toggleSection('preferences')}
                            className="w-full p-6 border-b border-white/5 bg-neutral-800/30 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Globe size={20} style={{ color: 'var(--accent)' }} />
                                <div className="text-left">
                                    <h2 className="text-lg font-bold text-white">Regional Settings</h2>
                                    <p className="text-xs text-neutral-400 mt-1">Customize language and region.</p>
                                </div>
                            </div>
                            <ChevronDown className={`transition-transform ${expandedSection === 'preferences' ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ${expandedSection === 'preferences' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300">Language</label>
                                    <select name="language" value={preferences.language} onChange={handlePreferenceChange} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500">
                                        {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-300">Country</label>
                                    <select name="country" value={preferences.country} onChange={handlePreferenceChange} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500">
                                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- SECURITY SECTION (With Verification Logic) --- */}
                    <section className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                        <button
                            type="button"
                            onClick={() => toggleSection('security')}
                            className="w-full p-6 border-b border-white/5 bg-neutral-800/30 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={20} style={{ color: 'var(--accent)' }} />
                                <div className="text-left">
                                    <h2 className="text-lg font-bold text-white">Password & Security</h2>
                                    <p className="text-xs text-neutral-400 mt-1">Manage password and security.</p>
                                </div>
                            </div>
                            <ChevronDown className={`transition-transform ${expandedSection === 'security' ? 'rotate-180' : ''}`} size={20} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-500 ${expandedSection === 'security' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 md:p-8 space-y-6">

                                {/* 1. Verify Current Password */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-neutral-300">Current Password</label>
                                    </div>
                                    <div className="relative group">
                                        <Lock size={16} className={`absolute left-4 top-3.5 transition-colors ${isPasswordVerified ? 'text-emerald-500' : 'text-neutral-500'}`} />
                                        <input
                                            type={showPassword.current ? "text" : "password"}
                                            name="currentPassword"
                                            value={security.currentPassword}
                                            onChange={handleSecurityChange}
                                            onBlur={handleCurrentPasswordBlur} // <--- Trigger Verification
                                            className={`
                                                    w-full bg-neutral-950 border rounded-xl pl-11 pr-12 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-600
                                                    ${isPasswordVerified
                                                    ? 'border-emerald-500 ring-1 ring-emerald-500' // Green Outline if verified
                                                    : 'border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'}
                                                `}
                                            placeholder="Enter current password to unlock"
                                        />

                                        {/* Right side Icon logic: Loader vs Visibility Toggle */}
                                        <div className="absolute right-4 top-3.5 flex items-center gap-2">
                                            {isVerifying && <Loader2 size={16} className="animate-spin text-emerald-500" />}

                                            <button
                                                type="button"
                                                onClick={() => toggleVisibility('current')}
                                                className="text-neutral-500 hover:text-white transition-colors"
                                            >
                                                {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    {/* Status Text */}
                                    <div className="h-4">
                                        {isPasswordVerified && <span className="text-xs text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span>}
                                        {!isPasswordVerified && security.currentPassword.length > 0 && !isVerifying && <span className="text-xs text-neutral-500">Focus out to verify</span>}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-neutral-900 text-neutral-500">Set New Password</span>
                                    </div>
                                </div>

                                {/* 2. New Password Section (Disabled if not verified) */}
                                <div className={`space-y-6 transition-all duration-300 ${isPasswordVerified ? 'opacity-100' : 'opacity-40 pointer-events-none select-none grayscale'}`}>

                                    {/* Strength Bar */}
                                    <div className="h-1 bg-neutral-800 rounded-full overflow-hidden flex">
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <div key={i} className="flex-1 h-full transition-all duration-300 border-r border-neutral-900 last:border-0"
                                                style={{ backgroundColor: i < calculateStrength(security.newPassword) ? 'var(--accent)' : 'transparent' }} />
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-300">New Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-3.5 text-neutral-500" />
                                            <input
                                                type={showPassword.new ? "text" : "password"}
                                                name="newPassword"
                                                value={security.newPassword}
                                                onChange={handleSecurityChange}
                                                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-11 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                placeholder="Enter new password"
                                                disabled={!isPasswordVerified} // Standard HTML disable
                                            />
                                            <button type="button" onClick={() => toggleVisibility('new')} className="absolute right-4 top-3.5 text-neutral-500 hover:text-white">
                                                {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-300">Confirm Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-3.5 text-neutral-500" />
                                            <input
                                                type={showPassword.confirm ? "text" : "password"}
                                                name="confirmPassword"
                                                value={security.confirmPassword}
                                                onChange={handleSecurityChange}
                                                className={`w-full bg-neutral-950 border rounded-xl pl-11 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-1 
                                                        ${security.confirmPassword && security.newPassword !== security.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-neutral-700 focus:border-emerald-500 focus:ring-emerald-500'}`}
                                                placeholder="Retype new password"
                                                disabled={!isPasswordVerified}
                                            />
                                            <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute right-4 top-3.5 text-neutral-500 hover:text-white">
                                                {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- Action Bar --- */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading || (expandedSection === 'security' && !isPasswordVerified)}
                            className="px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 transition-all"
                            style={{ backgroundColor: 'var(--accent)', boxShadow: `0 4px 12px var(--accent-subtle)` }}
                        >
                            {isLoading ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                            ) : (
                                <><Save size={16} /> Save Changes</>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}