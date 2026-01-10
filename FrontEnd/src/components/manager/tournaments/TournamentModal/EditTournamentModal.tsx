import { useState, useEffect, useMemo } from "react";
import { editTournament } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useAppDispatch } from "../../../../hooks/hooks";
import type { EditTournamentModalProps, updateTournamentFormData } from "./types";
import { formats, initialEditFormData, mapTournamentToFormData, sports } from "./constants";
import FormInput from "./FormInput";
import ModalHeader from "../../../shared/modal/ModalHeader";
import FormActions from "../../../shared/modal/FormActions";
import MapPicker from "../../../shared/MapPicker";
import { validateTournamentForm } from "../../../../validators/ValidateTournamentForm";
import { Trophy, Calendar, Activity, FileText, Image as ImageIcon, MapPin, Watch } from "lucide-react";

export default function EditTournamentModal({
    isOpen,
    onClose,
    tournament,
    managerId,
    onShowPrizeInfo,
}: EditTournamentModalProps) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<updateTournamentFormData>(initialEditFormData(managerId, tournament._id));
    const [rulesText, setRulesText] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && tournament) {
            const mapped = mapTournamentToFormData(tournament);
            setFormData({ ...mapped });
            setRulesText(mapped.rules.join("\n"));
        }
    }, [isOpen, tournament]);

    const estimatedPrizePool = useMemo(() => {
        return Number(formData.entryFee) * Number(formData.minTeams);
    }, [formData.entryFee, formData.minTeams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            rules: rulesText.split("\n").map(r => r.trim()).filter(r => r),
        };

        const { isValid, errors: validationErrors } = validateTournamentForm(formattedData);
        setErrors(validationErrors);

        if (!isValid) {
            const firstError = document.querySelector('.text-destructive');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);

        const fd = new FormData();
        fd.append("_id", tournament._id);
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
        fd.append("prizePool", String(formattedData.prizePool)); // Allow manual override in Edit
        fd.append("playersPerTeam", String(formattedData.playersPerTeam));

        // Append conditional Overs if exists in type
        if (formattedData.sport === 'Cricket' && (formattedData).overs) {
            fd.append("overs", String((formattedData).overs));
        }

        formattedData.rules.forEach((rule, i) => {
            fd.append(`rules[${i}]`, rule);
        });

        if (formattedData.banner instanceof File) {
            fd.append("banner", formattedData.banner);
        }

        dispatch(editTournament({ formData: fd, tourId: tournament._id }))
            .unwrap()
            .then(() => handleClose())
            .catch((err) => {
                console.error("Error updating tournament", err);
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

        const isNumberField = [
            "maxTeams", "minTeams", "entryFee", "playersPerTeam", "prizePool", "overs"
        ].some(field => name.includes(field));

        setFormData((prev) => ({
            ...prev,
            [name]: isNumberField ? Number(value) : value,
        }));
    };

    const handleClose = () => {
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-4xl bg-card text-card-foreground rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <ModalHeader title="Edit Tournament" onClose={handleClose} disabled={isSubmitting} />

                <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide">
                    {/* ID added to form to link with sticky footer button */}
                    <form id="edit-tournament-form" onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                        {/* SECTION 1: Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                <Trophy size={16} className="text-primary" />
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
                                        placeholder="e.g. Summer Championship"
                                    />
                                    {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
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
                                    {errors.sport && <p className="text-xs text-destructive mt-1">{errors.sport}</p>}
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
                                    {errors.format && <p className="text-xs text-destructive mt-1">{errors.format}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: Schedule & Format */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                <Calendar size={16} className="text-blue-500" />
                                Schedule & Logistics
                            </h3>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <FormInput label="Start Date" type="date" name="startDate" value={String(formData.startDate).split('T')[0]} onChange={handleChange} />
                                    {errors.startDate && <p className="text-xs text-destructive mt-1">{errors.startDate}</p>}
                                </div>
                                <div>
                                    <FormInput label="End Date" type="date" name="endDate" value={String(formData.endDate).split('T')[0]} onChange={handleChange} />
                                    {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate}</p>}
                                </div>
                                <div>
                                    <FormInput label="Reg. Deadline" type="date" name="regDeadline" value={String(formData.regDeadline).split('T')[0]} onChange={handleChange} />
                                    {errors.regDeadline && <p className="text-xs text-destructive mt-1">{errors.regDeadline}</p>}
                                </div>
                            </div>

                            {/* Logistics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <FormInput label="Max Teams" type="number" name="maxTeams" value={formData.maxTeams} onChange={handleChange} min="2" />
                                    {errors.maxTeams && <p className="text-xs text-destructive mt-1">{errors.maxTeams}</p>}
                                </div>
                                <div>
                                    <FormInput label="Min Teams" type="number" name="minTeams" value={formData.minTeams} onChange={handleChange} min="2" />
                                    {errors.minTeams && <p className="text-xs text-destructive mt-1">{errors.minTeams}</p>}
                                </div>
                                <div>
                                    <FormInput label="Players / Team" type="number" name="playersPerTeam" value={formData.playersPerTeam} onChange={handleChange} min="2" />
                                    {errors.playersPerTeam && <p className="text-xs text-destructive mt-1">{errors.playersPerTeam}</p>}
                                </div>
                            </div>

                            {/* Cricket Overs (Conditional) */}
                            {formData.sport === 'cricket' && (
                                <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Watch size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <FormInput
                                                label="Overs per Innings"
                                                type="number"
                                                name="overs"
                                                value={(formData).overs || ''}
                                                onChange={handleChange}
                                                placeholder="e.g. 20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 3: Financials & Location */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                <Activity size={16} className="text-amber-500" />
                                Financials & Location
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Financials Card */}
                                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border h-fit">
                                    <div>
                                        <FormInput label="Entry Fee (per team)" type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} min="0" />
                                        {errors.entryFee && <p className="text-xs text-destructive mt-1">{errors.entryFee}</p>}
                                    </div>
                                    <div>
                                        <FormInput label="Total Prize Pool" type="number" name="prizePool" value={formData.prizePool} onChange={handleChange} min="0" />
                                        {errors.prizePool && <p className="text-xs text-destructive mt-1">{errors.prizePool}</p>}
                                    </div>

                                    {/* Calculated Reference */}
                                    <div className="mt-2 p-3 bg-card rounded-lg border border-border flex items-center justify-between shadow-sm">
                                        <div>
                                            <span className="text-xs text-muted-foreground block">Min. Collected Fees</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-md font-mono text-primary font-semibold">₹{estimatedPrizePool.toLocaleString()}</span>
                                            <button type="button" onClick={onShowPrizeInfo} className="text-[10px] text-blue-500 block hover:underline">Info</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <div className={`
                                        relative rounded-xl border transition-all duration-300 overflow-hidden group
                                        ${errors.location ? 'border-destructive/50' : formData.location ? 'border-primary/50' : 'border-border bg-muted/20'}
                                    `}>
                                        <div className="p-1.5 bg-card">
                                            <MapPicker
                                                initialLocation={{
                                                    lat: formData.latitude ?? 20.5937,
                                                    lng: formData.longitude ?? 78.9629,
                                                    address: formData.location
                                                }}
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
                                        <div className="px-3 py-2 border-t border-border bg-card/90 backdrop-blur-sm">
                                            {formData.location ? (
                                                <div className="flex items-start gap-2">
                                                    <MapPin size={14} className="text-primary mt-0.5" />
                                                    <p className="text-xs text-foreground">{formData.location}</p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">No location selected</p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4: Media & Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                <ImageIcon size={16} className="text-purple-500" />
                                Media & Details
                            </h3>

                            {/* Banner Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-muted-foreground">Tournament Banner</label>
                                <div className="flex flex-col items-center gap-3 border border-border border-dashed rounded-xl p-6 bg-muted/20 hover:bg-muted/30 transition-colors">
                                    {!formData.banner ? (
                                        <label className="w-full cursor-pointer flex flex-col items-center">
                                            <ImageIcon size={32} className="text-muted-foreground mb-2" />
                                            <span className="text-muted-foreground text-sm">Click to upload banner</span>
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
                                                src={
                                                    formData.banner instanceof File
                                                        ? URL.createObjectURL(formData.banner)
                                                        : formData.banner // Assume it's a string URL from backend
                                                }
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg shadow-md"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <label className="bg-background/80 hover:bg-background text-foreground text-xs px-3 py-1.5 rounded-full cursor-pointer backdrop-blur-md shadow-sm border border-border transition-colors">
                                                    Change
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
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, banner: undefined }))}
                                                    className="bg-destructive/90 hover:bg-destructive text-destructive-foreground text-xs px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                                        <FileText size={14} /> Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the tournament..."
                                        rows={4}
                                        className="w-full bg-background border border-input rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-input transition-all resize-none"
                                    />
                                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                                        <FileText size={14} /> Rules & Regulations
                                    </label>
                                    <textarea
                                        name="rules"
                                        value={rulesText}
                                        onChange={handleChange}
                                        placeholder="Enter each rule on a new line..."
                                        rows={4}
                                        className="w-full bg-background border border-input rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-input transition-all resize-none"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">Tip: Press Enter to separate rules.</p>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer for Actions */}
                        <div className="sticky bottom-0 -mx-6 -mb-6 p-4 bg-card border-t border-border z-10 md:-mx-8 md:-mb-8 rounded-b-2xl">
                            <FormActions
                                submitLabel="Save Changes"
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