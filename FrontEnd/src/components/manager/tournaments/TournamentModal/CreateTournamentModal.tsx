import { useState, useMemo } from "react";
import { createTournament } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useAppDispatch } from "../../../../hooks/hooks";
import type { TournamentFormData, CreateTournamentModalProps } from "./types";
import { formats, initialFormData, sports } from "./constants";
import FormInput from "./FormInput";
import ModalHeader from "../../../shared/modal/ModalHeader";
import FormActions from "../../../shared/modal/FormActions";
import MapPicker from "../../../shared/MapPicker";
import { validateTournamentForm } from "../../../../validators/ValidateTournamentForm";
import { Trophy, Calendar, Activity, FileText, Image as ImageIcon, MapPin, Watch } from "lucide-react";

export default function CreateTournamentModal({
    isOpen,
    onClose,
    managerId,
    onShowPrizeInfo,
}: CreateTournamentModalProps) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<TournamentFormData>(initialFormData(managerId));
    const [rulesText, setRulesText] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculated Prize Pool for visual feedback
    const estimatedPrizePool = useMemo(() => {
        return Number(formData.entryFee) * Number(formData.minTeams);
    }, [formData.entryFee, formData.minTeams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('jjj')

        const formattedData = {
            ...formData,
            rules: rulesText.split("\n").map((r) => r.trim()).filter((r) => r),
        };

        const { isValid, errors: validationErrors } = validateTournamentForm(formattedData);
        setErrors(validationErrors);

        if (!isValid) {
            const firstError = document.querySelector('.text-red-500');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        const fd = new FormData();

        // Append Standard Fields
        fd.append("managerId", managerId);
        fd.append("title", formattedData.title);
        fd.append("sport", formattedData.sport);
        fd.append("description", formattedData.description);
        fd.append("startDate", new Date(formattedData.startDate).toISOString());
        fd.append("endDate", new Date(formattedData.endDate).toISOString());
        fd.append("regDeadline", new Date(formattedData.regDeadline).toISOString());
        fd.append("location", formattedData.location);
        fd.append("latitude", String(formattedData.latitude ?? ""));
        fd.append("longitude", String(formattedData.longitude ?? ""));
        fd.append("maxTeams", String(formattedData.maxTeams));
        fd.append("minTeams", String(formattedData.minTeams));
        fd.append("entryFee", String(formattedData.entryFee));
        fd.append("format", formattedData.format);
        fd.append("prizePool", String(estimatedPrizePool));
        fd.append("playersPerTeam", String(formattedData.playersPerTeam));

        // Append Conditional Fields (Overs)
        if (formattedData.sport === 'Cricket' && formattedData.overs) {
            fd.append("overs", String(formattedData.overs));
        }

        formattedData.rules.forEach((rule, i) => {
            fd.append(`rules[${i}]`, rule);
        });

        if (formattedData.banner instanceof File) {
            fd.append("banner", formattedData.banner);
        }

        dispatch(createTournament(fd))
            .unwrap()
            .then(() => handleClose())
            .catch((err) => {
                console.error("Error in tournament creation", err);
                setIsSubmitting(false);
            });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "rules") {
            setRulesText(value);
            return;
        }

        // Handle number fields including 'overs'
        const isNumberField = [
            "maxTeams",
            "minTeams",
            "entryFee",
            "playersPerTeam",
            "overs"
        ].some(field => name.includes(field));

        setFormData((prev) => ({
            ...prev,
            [name]: isNumberField ? Number(value) : value,
        }));
    };

    const handleClose = () => {
        setFormData(initialFormData(managerId));
        setRulesText("");
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                <ModalHeader title="Create New Tournament" onClose={handleClose} disabled={isSubmitting} />

                <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                        {/* SECTION 1: Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                                <Trophy size={16} className="text-emerald-500" />
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <FormInput
                                        label="Tournament Name"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Summer Championship 2024"
                                    />
                                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <FormInput
                                        label="Sport"
                                        type="select"
                                        name="sport"
                                        value={formData.sport}
                                        onChange={handleChange}
                                        options={sports}
                                    />
                                    {errors.sport && <p className="text-xs text-red-500 mt-1">{errors.sport}</p>}
                                </div>

                                <div>
                                    <FormInput
                                        label="Format"
                                        type="select"
                                        name="format"
                                        value={formData.format}
                                        onChange={handleChange}
                                        options={formats}
                                    />
                                    {errors.format && <p className="text-xs text-red-500 mt-1">{errors.format}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: Schedule & Format */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                                <Calendar size={16} className="text-blue-500" />
                                Schedule & Format
                            </h3>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <FormInput label="Start Date" type="date" name="startDate" value={String(formData.startDate)} onChange={handleChange} />
                                    {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                                </div>
                                <div>
                                    <FormInput label="End Date" type="date" name="endDate" value={String(formData.endDate)} onChange={handleChange} />
                                    {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                                </div>
                                <div>
                                    <FormInput label="Reg. Deadline" type="date" name="regDeadline" value={String(formData.regDeadline)} onChange={handleChange} />
                                    {errors.regDeadline && <p className="text-xs text-red-500 mt-1">{errors.regDeadline}</p>}
                                </div>
                            </div>

                            {/* Team Logistics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <FormInput label="Max Teams" type="number" name="maxTeams" value={formData.maxTeams} onChange={handleChange} min="2" />
                                    {errors.maxTeams && <p className="text-xs text-red-500 mt-1">{errors.maxTeams}</p>}
                                </div>
                                <div>
                                    <FormInput label="Min Teams" type="number" name="minTeams" value={formData.minTeams} onChange={handleChange} min="2" />
                                    {errors.minTeams && <p className="text-xs text-red-500 mt-1">{errors.minTeams}</p>}
                                </div>
                                <div>
                                    <FormInput label="Players / Team" type="number" name="playersPerTeam" value={formData.playersPerTeam} onChange={handleChange} min="2" />
                                    {errors.playersPerTeam && <p className="text-xs text-red-500 mt-1">{errors.playersPerTeam}</p>}
                                </div>
                            </div>

                            {/* CRICKET SPECIFIC FIELD */}
                            {formData.sport === 'cricket' && (
                                <div className="mt-4 p-4 rounded-xl bg-emerald-900/10 border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                        <div className="text-sm text-emerald-200 flex items-start gap-2">
                                            <Watch size={18} className="mt-0.5 shrink-0" />
                                            <div>
                                                <span className="font-bold block">Cricket Settings</span>
                                                <span className="text-xs opacity-70">Configure overs to set match duration.</span>
                                            </div>
                                        </div>
                                        <div>
                                            <FormInput
                                                label="Overs per Innings"
                                                type="number"
                                                name="overs"
                                                value={formData.overs || ''}
                                                onChange={handleChange}
                                                min="5"
                                                placeholder="e.g. 20 (T20)"
                                            />
                                            {errors.overs && <p className="text-xs text-red-500 mt-1">{errors.overs}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 3: Financials & Location */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                                <Activity size={16} className="text-amber-500" />
                                Financials & Location
                            </h3>

                            <div className="gap-8">
                                {/* Fees Card */}
                                <div className="space-y-4 bg-neutral-800/20 p-4 rounded-xl border border-white/5 h-fit">
                                    <div>
                                        <FormInput label="Entry Fee (per team)" type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} min="0" />
                                        {errors.entryFee && <p className="text-xs text-red-500 mt-1">{errors.entryFee}</p>}
                                    </div>

                                    {/* Auto-calculated Prize Pool Preview */}
                                    <div className="mt-4 p-3 bg-neutral-900 rounded-lg border border-white/10 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-neutral-400 block">Estimated Prize Pool</span>
                                            <span className="text-xs text-neutral-600">(Based on Min Teams)</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-emerald-400">₹{estimatedPrizePool.toLocaleString()}</span>
                                            <button type="button" onClick={onShowPrizeInfo} className="text-[10px] text-blue-400 block hover:underline">How is this calculated?</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Location Picker */}
                            <div>
                                <div className="space-y-3">

                                    {/* Header Label */}
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <MapPin size={16} className="text-red-500" />
                                            Tournament Venue
                                        </label>
                                        {formData.location && (
                                            <span className="hidden sm:inline-block text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                                                Venue Confirmed
                                            </span>
                                        )}
                                    </div>

                                    {/* Integrated Card Container */}
                                    <div className={`
                                        relative rounded-xl border transition-all duration-300 overflow-hidden group
                                        ${errors.location
                                            ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                            : formData.location
                                                ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                                : 'border-white/10 bg-neutral-800/20'
                                        }
                                            `}>
                                        {/* Map Area */}
                                        <div className="p-1.5 bg-neutral-900/50">
                                            <MapPicker
                                                onSelectLocation={(data) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        location: data.address,
                                                        latitude: data.lat,
                                                        longitude: data.lng,
                                                    }));
                                                }}
                                            />
                                        </div>

                                        {/* Address Status Footer */}
                                        <div className={`
                                            px-4 py-3 border-t backdrop-blur-md transition-colors
                                            ${formData.location ? 'bg-neutral-900/90 border-emerald-500/20' : 'bg-neutral-900/60 border-white/5'}
                                        `}>
                                            {formData.location ? (
                                                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0 border border-emerald-500/20">
                                                        <MapPin size={18} fill="currentColor" className="opacity-80" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Selected Venue</p>
                                                        <p className="text-sm text-white font-medium leading-snug break-words">
                                                            {formData.location}
                                                        </p>
                                                        {formData.latitude && (
                                                            <p className="text-[10px] text-neutral-600 font-mono mt-1 flex items-center gap-2">
                                                                <span>Lat: {Number(formData.latitude).toFixed(4)}</span>
                                                                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                                                <span>Lng: {Number(formData.longitude).toFixed(4)}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 text-neutral-500">
                                                    <div className="p-2 rounded-lg bg-white/5 shrink-0 border border-white/5">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-0.5">No Location</p>
                                                        <p className="text-xs italic text-neutral-400">Search above or click on the map to pin the venue.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Validation Error */}
                                    {errors.location && (
                                        <div className="flex items-center gap-2 text-red-400 text-xs px-1 animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            {errors.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: Media & Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                                <ImageIcon size={16} className="text-purple-500" />
                                Media & Details
                            </h3>

                            {/* Banner Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Tournament Banner</label>
                                <div className="flex flex-col items-center gap-3 border border-neutral-600 border-dashed rounded-xl p-6 bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                                    {!formData.banner ? (
                                        <label className="w-full cursor-pointer flex flex-col items-center">
                                            <ImageIcon size={32} className="text-neutral-500 mb-2" />
                                            <span className="text-gray-300 text-sm mb-1">Click to upload banner</span>
                                            <span className="text-neutral-500 text-xs">JPG, PNG, WEBP (Max 5MB)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setFormData((prev) => ({ ...prev, banner: file }));
                                                }}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative w-full">
                                            <img
                                                src={URL.createObjectURL(formData.banner as Blob)}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg shadow-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, banner: undefined }))}
                                                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md transition-colors"
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                                        <FileText size={14} /> Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the tournament..."
                                        rows={4}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                                        <FileText size={14} /> Rules & Regulations
                                    </label>
                                    <textarea
                                        name="rules"
                                        value={rulesText}
                                        onChange={handleChange}
                                        placeholder="Enter each rule on a new line..."
                                        rows={4}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                    <p className="text-[10px] text-neutral-500 mt-1">Tip: Press Enter to separate rules.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-900 border-t border-white/10 z-10">
                            <FormActions
                                submitLabel="Create Tournament"
                                onCancel={handleClose}
                                disabled={isSubmitting}
                                loading={isSubmitting}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}