import { Save, Lock, Globe, Eye, EyeOff, ShieldCheck, Settings, AlertCircle, CheckCircle2, Loader2, Palette, Moon, Sun, Laptop } from "lucide-react";
import type { Theme } from "../../types/UserRoles";
import FormField from "../../components/shared/FormField";
import { SectionCard } from "../../components/shared/SectionCard";
import { useSettingsPage } from "../../hooks/useSettingsPage";
import { COLOR_PALETTES, COUNTRIES, LANGUAGES } from "../../constants/Settings";


export default function SettingsPage() {
    const {
        theme, color, security, preferences, showPassword, expandedSection, passwordScore,
        isLoading, isVerifying, isPasswordVerified, reduxError, successMessage,
        setTheme, setColor, handleSecurityChange, handlePreferenceChange,
        handleCurrentPasswordBlur, toggleVisibility, toggleSection, handleSave
    } = useSettingsPage();

    return (
        <div className="text-foreground px-4 md:px-6 bg-background transition-colors duration-300">
            <div className="mx-auto space-y-6">

                {/* --- Page Header --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Settings className="text-primary" size={32} /> Settings
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account security, appearance, and localization preferences.
                        </p>
                    </div>

                    {(successMessage || reduxError) && (
                        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2
                            ${successMessage ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                            {successMessage ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {successMessage || reduxError}
                        </div>
                    )}
                </header>

                <form onSubmit={handleSave} className="space-y-6">

                    {/* --- 1. APPEARANCE SECTION --- */}
                    <SectionCard
                        title="Appearance"
                        icon={<Palette size={20} />}
                        description="Customize look and feel."
                        isOpen={expandedSection === 'appearance'}
                        onToggle={() => toggleSection('appearance')}
                    >
                        <div className="space-y-8">
                            {/* Theme Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-medium text-foreground">Theme Preference</label>
                                    <span className="text-xs text-muted-foreground">Select your interface style</span>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { val: 'light', icon: Sun, lbl: 'Light' },
                                        { val: 'dark', icon: Moon, lbl: 'Dark' },
                                        { val: 'system', icon: Laptop, lbl: 'System' }
                                    ].map((item) => (
                                        <button
                                            key={item.val}
                                            type="button"
                                            onClick={() => setTheme(item.val as Theme)}
                                            className={`
                                                relative flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20
                                                ${theme === item.val
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                    : 'bg-background text-muted-foreground border-input hover:bg-muted hover:text-foreground'
                                                }
                                            `}
                                        >
                                            <item.icon size={16} className={theme === item.val ? "text-primary-foreground" : "text-muted-foreground"} />
                                            <span>{item.lbl}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px w-full bg-border/50" />

                            {/* Accent Color Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-medium text-foreground">Accent Color</label>
                                    <span className="text-xs text-muted-foreground">Primary brand color</span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {COLOR_PALETTES.map((palette) => (
                                        <button
                                            key={palette.id}
                                            type="button"
                                            onClick={() => setColor(palette.id)}
                                            className={`
                                                group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                                ${palette.bgClass}
                                                ${color === palette.id
                                                    ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110'
                                                    : 'hover:scale-110 hover:shadow-md'
                                                }
                                            `}
                                            title={palette.label}
                                        >
                                            {color === palette.id && (
                                                <CheckCircle2 className="text-white w-5 h-5 animate-in zoom-in duration-300 drop-shadow-md" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* --- 2. REGIONAL SETTINGS SECTION --- */}
                    <SectionCard
                        title="Regional Settings"
                        icon={<Globe size={20} />}
                        description="Customize language and region."
                        isOpen={expandedSection === 'preferences'}
                        onToggle={() => toggleSection('preferences')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                id="language"
                                name="language"
                                label="Language"
                                as="select"
                                value={preferences.language}
                                onChange={handlePreferenceChange}
                                options={LANGUAGES.map(l => l.name)}
                            />

                            <FormField
                                id="country"
                                name="country"
                                label="Country"
                                as="select"
                                value={preferences.country}
                                onChange={handlePreferenceChange}
                                options={COUNTRIES.map(c => c.name)}
                            />
                        </div>
                    </SectionCard>

                    {/* --- 3. SECURITY SECTION --- */}
                    <SectionCard
                        title="Password & Security"
                        icon={<ShieldCheck size={20} />}
                        description="Manage password and security."
                        isOpen={expandedSection === 'security'}
                        onToggle={() => toggleSection('security')}
                    >
                        <div className="space-y-6">
                            {/* CURRENT PASSWORD */}
                            <FormField
                                id="currentPassword"
                                name="currentPassword"
                                label="Current Password"
                                type={showPassword.current ? "text" : "password"}
                                value={security.currentPassword}
                                onChange={handleSecurityChange}
                                onBlur={handleCurrentPasswordBlur}
                                placeholder="Enter current password to unlock"
                                inputClassName={isPasswordVerified ? "!border-primary !ring-1 !ring-primary" : ""}
                                startIcon={<Lock size={16} className={isPasswordVerified ? "text-primary" : ""} />}
                                endIcon={
                                    <>
                                        {isVerifying && <Loader2 size={16} className="animate-spin text-primary" />}
                                        <button type="button" onClick={() => toggleVisibility('current')} className="text-muted-foreground hover:text-foreground">
                                            {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </>
                                }
                                helperText={!isPasswordVerified && security.currentPassword.length > 0 && !isVerifying ? "Focus out to verify" : undefined}
                            />

                            {/* Verified Indicator */}
                            {isPasswordVerified && (
                                <div className="-mt-1 text-xs text-primary flex items-center gap-1 animate-in fade-in">
                                    <CheckCircle2 size={12} /> Verified
                                </div>
                            )}

                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                <div className="relative flex justify-center text-xs"><span className="px-2 bg-card text-muted-foreground">Set New Password</span></div>
                            </div>

                            {/* NEW PASSWORD AREA */}
                            <div className={`space-y-6 transition-all duration-300 ${isPasswordVerified ? 'opacity-100' : 'opacity-40 pointer-events-none select-none grayscale'}`}>
                                {/* Strength Bar */}
                                <div className="h-1 bg-muted rounded-full overflow-hidden flex">
                                    {Array.from({ length: 4 }, (_, i) => (
                                        <div key={i} className="flex-1 h-full transition-all duration-300 border-r border-background last:border-0"
                                            style={{ backgroundColor: i < passwordScore ? 'hsl(var(--primary))' : 'transparent' }} />
                                    ))}
                                </div>

                                <FormField
                                    id="newPassword"
                                    name="newPassword"
                                    label="New Password"
                                    type={showPassword.new ? "text" : "password"}
                                    value={security.newPassword}
                                    onChange={handleSecurityChange}
                                    placeholder="Enter new password"
                                    disabled={!isPasswordVerified}
                                    startIcon={<Lock size={16} />}
                                    endIcon={
                                        <button type="button" onClick={() => toggleVisibility('new')} className="text-muted-foreground hover:text-foreground">
                                            {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                />

                                <FormField
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type={showPassword.confirm ? "text" : "password"}
                                    value={security.confirmPassword}
                                    onChange={handleSecurityChange}
                                    placeholder="Retype new password"
                                    disabled={!isPasswordVerified}
                                    startIcon={<Lock size={16} />}
                                    endIcon={
                                        <button type="button" onClick={() => toggleVisibility('confirm')} className="text-muted-foreground hover:text-foreground">
                                            {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                    error={security.confirmPassword && security.newPassword !== security.confirmPassword ? "Passwords do not match" : undefined}
                                />
                            </div>
                        </div>
                    </SectionCard>

                    {/* --- Action Bar --- */}
                    <div className="flex justify-end sticky bottom-4 z-10">
                        <button type="submit" disabled={isLoading || (expandedSection === 'security' && !isPasswordVerified)}
                            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:bg-primary/90 active:scale-95">
                            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}