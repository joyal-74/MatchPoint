import { useState, useEffect } from "react";
import { verifyCurrentPassword, updatePassword, updatePrivacySettings } from "../../features/shared/settings/settingsThunk";
import { 
    Save, Lock, Globe, Eye, EyeOff, ShieldCheck, 
    Settings, AlertCircle, CheckCircle2, ChevronDown, 
    Loader2, Palette, Moon, Sun, Laptop 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { invalidatePasswordVerification, resetSettingsState } from "../../features/shared/settings/settingsSlice";
import { useTheme } from "../../context/ThemeContext"; 
import type { Theme } from "../../types/UserRoles";

// Constants
const LANGUAGES = [{ code: "en", name: "English (US)" }, { code: "en-gb", name: "English (UK)" }, { code: "hi", name: "Hindi" }];
const COUNTRIES = [{ code: "US", name: "United States" }, { code: "IN", name: "India" }, { code: "UK", name: "United Kingdom" }, { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" }, { code: "AE", name: "United Arab Emirates" }];

// Color Palette Definition for UI rendering
const COLOR_PALETTES = [
    { id: 'blue', label: 'Royal', bgClass: 'bg-blue-500' },
    { id: 'green', label: 'Emerald', bgClass: 'bg-emerald-500' },
    { id: 'violet', label: 'Violet', bgClass: 'bg-violet-500' },
    { id: 'orange', label: 'Sunset', bgClass: 'bg-orange-500' },
    { id: 'teal', label: 'Teal', bgClass: 'bg-teal-500' },
] as const;

const calculateStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;
    return score;
};

export default function SettingsPage() {
    const dispatch = useAppDispatch();
    
    // 1. Integrate Theme Context
    const { theme, setTheme, color, setColor } = useTheme();

    // Select state from Redux
    const {
        isLoading,
        isVerifying,
        isPasswordVerified,
        error: reduxError,
        successMessage
    } = useAppSelector((state) => state.settings);

    const userId = useAppSelector(state => state.auth.user?._id);

    const [expandedSection, setExpandedSection] = useState<string | null>('appearance');

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
            if (!isPasswordVerified) return;

            if (security.newPassword !== security.confirmPassword) {
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
        else if (expandedSection === 'preferences' && userId) {
            dispatch(updatePrivacySettings({ userId, language: preferences.language, country: preferences.country }));
        }
    };

    return (
        <div className="text-foreground p-4 md:p-8 bg-background transition-colors duration-300">
            <div className="mx-auto space-y-6 max-w-47xl">

                {/* --- Page Header --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Settings className="text-primary" size={32} />
                            Settings
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account security, appearance, and localization preferences.
                        </p>
                    </div>

                    {/* Global Messages */}
                    {(successMessage || reduxError) && (
                        <div className={`
                                px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2
                                ${successMessage
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                                    : 'bg-destructive/10 text-destructive border border-destructive/20'}
                            `}>
                            {successMessage ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {successMessage || reduxError}
                        </div>
                    )}
                </header>

                <form onSubmit={handleSave} className="space-y-6">

                    {/* --- 1. APPEARANCE SECTION (New) --- */}
                    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <button
                            type="button"
                            onClick={() => toggleSection('appearance')}
                            className="w-full p-6 border-b border-border bg-muted/20 flex items-center justify-between hover:bg-muted/40 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Palette size={20} />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-lg font-bold text-foreground">Appearance</h2>
                                    <p className="text-xs text-muted-foreground mt-1">Customize look and feel.</p>
                                </div>
                            </div>
                            <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${expandedSection === 'appearance' ? 'rotate-180' : ''}`} size={20} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === 'appearance' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 md:p-8 space-y-8">
                                
                                {/* Theme Mode */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-4 block">Theme Mode</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { value: 'light', icon: Sun, label: 'Light' },
                                            { value: 'dark', icon: Moon, label: 'Dark' },
                                            { value: 'system', icon: Laptop, label: 'System' }
                                        ].map((item) => (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() => setTheme(item.value as Theme)}
                                                className={`
                                                    flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200
                                                    ${theme === item.value 
                                                        ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary' 
                                                        : 'bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground'}
                                                `}
                                            >
                                                <item.icon size={24} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Accent Color */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-4 block">Accent Color</label>
                                    <div className="flex flex-wrap gap-4">
                                        {COLOR_PALETTES.map((palette) => (
                                            <button
                                                key={palette.id}
                                                type="button"
                                                onClick={() => setColor(palette.id)}
                                                className={`
                                                    group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                                                    ${palette.bgClass}
                                                    ${color === palette.id ? 'ring-4 ring-offset-2 ring-offset-background ring-primary scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}
                                                `}
                                                title={palette.label}
                                            >
                                                {color === palette.id && <CheckCircle2 className="text-white w-6 h-6 animate-in zoom-in" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- 2. REGIONAL SETTINGS SECTION --- */}
                    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <button
                            type="button"
                            onClick={() => toggleSection('preferences')}
                            className="w-full p-6 border-b border-border bg-muted/20 flex items-center justify-between hover:bg-muted/40 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Globe size={20} />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-lg font-bold text-foreground">Regional Settings</h2>
                                    <p className="text-xs text-muted-foreground mt-1">Customize language and region.</p>
                                </div>
                            </div>
                            <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${expandedSection === 'preferences' ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === 'preferences' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Language</label>
                                    <select name="language" value={preferences.language} onChange={handlePreferenceChange} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                                        {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Country</label>
                                    <select name="country" value={preferences.country} onChange={handlePreferenceChange} className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- 3. SECURITY SECTION --- */}
                    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <button
                            type="button"
                            onClick={() => toggleSection('security')}
                            className="w-full p-6 border-b border-border bg-muted/20 flex items-center justify-between hover:bg-muted/40 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-lg font-bold text-foreground">Password & Security</h2>
                                    <p className="text-xs text-muted-foreground mt-1">Manage password and security.</p>
                                </div>
                            </div>
                            <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${expandedSection === 'security' ? 'rotate-180' : ''}`} size={20} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === 'security' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 md:p-8 space-y-6">

                                {/* Verify Current Password */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-foreground">Current Password</label>
                                    </div>
                                    <div className="relative group">
                                        <Lock size={16} className={`absolute left-4 top-3.5 transition-colors ${isPasswordVerified ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <input
                                            type={showPassword.current ? "text" : "password"}
                                            name="currentPassword"
                                            value={security.currentPassword}
                                            onChange={handleSecurityChange}
                                            onBlur={handleCurrentPasswordBlur}
                                            className={`
                                                w-full bg-background border rounded-xl pl-11 pr-12 py-3 text-sm text-foreground focus:outline-none transition-all placeholder:text-muted-foreground/50
                                                ${isPasswordVerified
                                                    ? 'border-primary ring-1 ring-primary'
                                                    : 'border-input focus:border-primary focus:ring-1 focus:ring-primary'}
                                            `}
                                            placeholder="Enter current password to unlock"
                                        />
                                        <div className="absolute right-4 top-3.5 flex items-center gap-2">
                                            {isVerifying && <Loader2 size={16} className="animate-spin text-primary" />}
                                            <button
                                                type="button"
                                                onClick={() => toggleVisibility('current')}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-4">
                                        {isPasswordVerified && <span className="text-xs text-primary flex items-center gap-1 animate-in fade-in"><CheckCircle2 size={12} /> Verified</span>}
                                        {!isPasswordVerified && security.currentPassword.length > 0 && !isVerifying && <span className="text-xs text-muted-foreground">Focus out to verify</span>}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-card text-muted-foreground">Set New Password</span>
                                    </div>
                                </div>

                                {/* New Password Section */}
                                <div className={`space-y-6 transition-all duration-300 ${isPasswordVerified ? 'opacity-100' : 'opacity-40 pointer-events-none select-none grayscale'}`}>
                                    {/* Strength Bar */}
                                    <div className="h-1 bg-muted rounded-full overflow-hidden flex">
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <div key={i} className="flex-1 h-full transition-all duration-300 border-r border-background last:border-0"
                                                style={{ backgroundColor: i < calculateStrength(security.newPassword) ? 'hsl(var(--primary))' : 'transparent' }} />
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">New Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-3.5 text-muted-foreground" />
                                            <input
                                                type={showPassword.new ? "text" : "password"}
                                                name="newPassword"
                                                value={security.newPassword}
                                                onChange={handleSecurityChange}
                                                className="w-full bg-background border border-input rounded-xl pl-11 pr-12 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                placeholder="Enter new password"
                                                disabled={!isPasswordVerified}
                                            />
                                            <button type="button" onClick={() => toggleVisibility('new')} className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground">
                                                {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Confirm Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-4 top-3.5 text-muted-foreground" />
                                            <input
                                                type={showPassword.confirm ? "text" : "password"}
                                                name="confirmPassword"
                                                value={security.confirmPassword}
                                                onChange={handleSecurityChange}
                                                className={`w-full bg-background border rounded-xl pl-11 pr-12 py-3 text-sm text-foreground focus:outline-none focus:ring-1 
                                                    ${security.confirmPassword && security.newPassword !== security.confirmPassword 
                                                        ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                                                        : 'border-input focus:border-primary focus:ring-primary'}`}
                                                placeholder="Retype new password"
                                                disabled={!isPasswordVerified}
                                            />
                                            <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground">
                                                {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- Action Bar --- */}
                    <div className="flex justify-end pt-4 sticky bottom-4 z-10">
                        <button
                            type="submit"
                            disabled={isLoading || (expandedSection === 'security' && !isPasswordVerified)}
                            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:bg-primary/90 active:scale-95"
                        >
                            {isLoading ? (
                                <><Loader2 size={16} className="animate-spin" /> Saving...</>
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