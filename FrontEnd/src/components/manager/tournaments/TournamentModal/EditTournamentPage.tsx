import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editTournament, fetchTournament } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { initialEditFormData, mapTournamentToFormData, sports, formats } from "./constants";
import FormInput from "./FormInput";
import MapPicker from "../../../shared/MapPicker";
import { validateTournamentForm } from "../../../../validators/ValidateTournamentForm";
import {
    Trophy, Calendar, Activity, FileText, Image as ImageIcon,
    MapPin, ChevronLeft, Save, Sparkles, Info, Users
} from "lucide-react";
import Navbar from "../../Navbar";
import LoadingOverlay from "../../../shared/LoadingOverlay";

export default function EditTournamentPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAppSelector(state => state.auth);
    const { selectedTournament, loading } = useAppSelector(state => state.managerTournaments);

    // State
    const [formData, setFormData] = useState(initialEditFormData(user?._id || "", id || ""));
    const [rulesText, setRulesText] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Helpers
    // Convert string array to options for select
    const toOptions = (items: string[]) => items.map(item => ({ value: item, label: item }));
    // Safe date formatter
    const formatDate = (date: string | Date) => {
        if (!date) return "";
        return new Date(date).toISOString().split('T')[0];
    };

    // 1. Fetch Data if missing
    useEffect(() => {
        if (id && !selectedTournament) {
            dispatch(fetchTournament(id));
        }
    }, [id, selectedTournament, dispatch]);

    // 2. Populate Form
    useEffect(() => {
        if (selectedTournament) {
            const mapped = mapTournamentToFormData(selectedTournament);
            setFormData(mapped);
            setRulesText(mapped.rules.join("\n"));
        }
    }, [selectedTournament]);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "rules") { setRulesText(value); return; }
        const isNumberField = ["maxTeams", "minTeams", "entryFee", "playersPerTeam", "overs", "prizePool"].some(field => name.includes(field));
        setFormData(prev => ({ ...prev, [name]: isNumberField ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        const formattedData = {
            ...formData,
            rules: rulesText.split("\n").map(r => r.trim()).filter(r => r),
        };

        const { isValid, errors: validationErrors } = validateTournamentForm(formattedData);
        setErrors(validationErrors);

        if (!isValid) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        const fd = new FormData();

        fd.append("_id", id);
        fd.append("managerId", user?._id || "");

        Object.entries(formattedData).forEach(([key, value]) => {
            if (key === 'rules' || key === 'banner' || key === '_id' || key === 'managerId') return;
            fd.append(key, String(value));
        });

        formattedData.rules.forEach((r, i) => fd.append(`rules[${i}]`, r));

        if (formattedData.banner instanceof File) {
            fd.append("banner", formattedData.banner);
        }

        try {
            await dispatch(editTournament({ formData: fd, tourId: id })).unwrap();
            navigate(`/manager/tournaments/${id}/manage`);
        } catch (err) {
            console.error("Failed to update", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !formData.title) return <LoadingOverlay show={true} />;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
            <Navbar />

            {/* --- HEADER --- */}
            <div className={`sticky top-[64px] z-30 transition-all duration-300 border-b ${scrolled ? 'bg-background/80 backdrop-blur-md border-border shadow-sm' : 'bg-background border-transparent'}`}>
                <div className="mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Edit Tournament</h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">Update details for {formData.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="hidden sm:block px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none">
                            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* === LEFT COLUMN (Core Info) === */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. BASIC INFO */}
                        <section className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Trophy size={20} /></div>
                                <h2 className="text-lg font-bold">Basic Information</h2>
                            </div>
                            <div className="space-y-6">
                                <FormInput label="Tournament Name" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <FormInput label="Sport" type="select" name="sport" value={formData.sport} onChange={handleChange} options={toOptions(sports)} error={errors.sport} />
                                    <FormInput label="Format" type="select" name="format" value={formData.format} onChange={handleChange} options={toOptions(formats)} error={errors.format} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-background border border-input rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
                                    {errors.description && <p className="text-xs text-destructive mt-2">{errors.description}</p>}
                                </div>
                            </div>
                        </section>

                        {/* 2. SCHEDULE */}
                        <section className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Calendar size={20} /></div>
                                <h2 className="text-lg font-bold">Schedule</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <FormInput label="Start Date" type="date" name="startDate" value={formatDate(formData.startDate)} onChange={handleChange} error={errors.startDate} />
                                <FormInput label="End Date" type="date" name="endDate" value={formatDate(formData.endDate)} onChange={handleChange} error={errors.endDate} />
                                <FormInput label="Reg. Deadline" type="date" name="regDeadline" value={formatDate(formData.regDeadline)} onChange={handleChange} error={errors.regDeadline} />
                            </div>
                        </section>

                        {/* 3. LOCATION */}
                        <section className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm h-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500"><MapPin size={20} /></div>
                                <h2 className="text-lg font-bold">Venue Location</h2>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-border bg-muted/20">
                                <div className="p-1.5">
                                    <MapPicker
                                        initialLocation={{ lat: Number(formData.latitude), lng: Number(formData.longitude), address: formData.location }}
                                        onSelectLocation={(data) => setFormData(prev => ({ ...prev, location: data.address, latitude: data.lat, longitude: data.lng }))}
                                    />
                                </div>
                                <div className={`px-5 py-4 border-t border-border flex items-center gap-3 ${formData.location ? 'bg-card' : 'bg-muted/30'}`}>
                                    <MapPin size={18} className={formData.location ? "text-primary" : "text-muted-foreground"} />
                                    <span className="text-sm font-medium text-foreground flex-1 truncate">{formData.location || "Search or click on map to pin location"}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* === RIGHT COLUMN (Mechanics & Visuals) === */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* 1. BANNER */}
                        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Banner Image</h3>
                                <Sparkles size={14} className="text-yellow-500" />
                            </div>
                            <div className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/10 transition-all group relative overflow-hidden flex flex-col items-center justify-center">
                                {formData.banner ? (
                                    <>
                                        <img
                                            src={formData.banner instanceof File ? URL.createObjectURL(formData.banner) : formData.banner as string}
                                            className="w-full h-full object-cover"
                                            alt="Banner"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button onClick={() => setFormData(prev => ({ ...prev, banner: undefined }))} className="bg-destructive text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">Change</button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                        <ImageIcon size={24} className="text-muted-foreground mb-2" />
                                        <span className="text-xs font-medium text-muted-foreground">Click to upload</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setFormData(prev => ({ ...prev, banner: e.target.files![0] })); }} />
                                    </label>
                                )}
                            </div>
                        </section>

                        {/* 2. TEAM LOGISTICS (Moved here) */}
                        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500"><Users size={20} /></div>
                                <h2 className="text-lg font-bold">Team Logistics</h2>
                            </div>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <FormInput label="Min Teams" type="number" name="minTeams" value={formData.minTeams} onChange={handleChange} min="2" error={errors.minTeams} />
                                    <FormInput label="Max Teams" type="number" name="maxTeams" value={formData.maxTeams} onChange={handleChange} min="2" error={errors.maxTeams} />
                                </div>
                                <FormInput label="Players per Team" type="number" name="playersPerTeam" value={formData.playersPerTeam} onChange={handleChange} min="1" error={errors.playersPerTeam} />
                            </div>
                        </section>

                        {/* 3. FINANCIALS */}
                        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -mr-6 -mt-6 pointer-events-none" />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><Activity size={20} /></div>
                                <h2 className="text-lg font-bold">Financials</h2>
                            </div>
                            <div className="space-y-5">
                                <FormInput label="Entry Fee (₹)" type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} error={errors.entryFee} />
                                <FormInput label="Total Prize Pool (₹)" type="number" name="prizePool" value={formData.prizePool} onChange={handleChange} error={errors.prizePool} />
                                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="flex gap-2 items-start">
                                        <Info size={12} className="text-muted-foreground mt-0.5" />
                                        <p className="text-[10px] text-muted-foreground leading-tight">
                                            You can manually override the Prize Pool amount in Edit mode.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. RULES (Moved here) */}
                        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><FileText size={20} /></div>
                                <h2 className="text-lg font-bold">Rules</h2>
                            </div>
                            <textarea name="rules" value={rulesText} onChange={handleChange} rows={8} className="w-full bg-background border border-input rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-mono" />
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}