import { X, Users, Trophy, DollarSign, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface EditTournamentModalProps {
    isOpen: boolean;
    onClose: () => void;
    tournament: any; // you can replace with a proper Tournament type interface
    onUpdate: (updatedData: any) => void;
}

export default function EditTournamentModal({
    isOpen,
    onClose,
    tournament,
    onUpdate,
}: EditTournamentModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sport: "",
        startDate: "",
        registrationDeadline: "",
        location: "",
        maxParticipants: "",
        minParticipants: "",
        entryFee: "",
        format: "",
        pricePool: "",
    });

    const sports = ["Cricket"];
    const formats = ["Knockout", "League", "Friendly"];

    // Prefill form when modal opens with tournament data
    useEffect(() => {
        if (tournament) {
            setFormData({
                name: tournament.name || "",
                description: tournament.description || "",
                sport: tournament.sport || "",
                startDate: tournament.startDate || "",
                registrationDeadline: tournament.registrationDeadline || "",
                location: tournament.location || "",
                maxParticipants: tournament.maxParticipants || "",
                minParticipants: tournament.minParticipants || "",
                entryFee: tournament.entryFee || "",
                format: tournament.format || "",
                pricePool: tournament.pricePool || "",
            });
        }
    }, [tournament]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated Tournament Data:", formData);
        onUpdate(formData); // pass back to parent
        onClose();
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl">
                    {/* Header */}
                    <div className="p-6 border-b border-neutral-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                    Edit Tournament
                                </h2>
                                <p className="text-neutral-400 mt-1">
                                    Update the details of your tournament
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg bg-neutral-700/50 hover:bg-neutral-600/50 transition-colors duration-200"
                            >
                                <X size={20} className="text-neutral-400" />
                            </button>
                        </div>
                    </div>

                    {/* Form (same as create, but prefilled) */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tournament Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Trophy size={15} className="text-green-400" />
                                    Tournament Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter tournament name"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Select Sport */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Users size={15} className="text-blue-400" />
                                    Select Sport
                                </label>
                                <select
                                    name="sport"
                                    value={formData.sport}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                    required
                                >
                                    <option value="">Select sport event</option>
                                    {sports.map((sport) => (
                                        <option key={sport} value={sport}>
                                            {sport}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Calendar size={15} className="text-orange-400" />
                                    Tournament Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Registration Deadline */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Calendar size={15} className="text-red-400" />
                                    Registration Deadline
                                </label>
                                <input
                                    type="date"
                                    name="registrationDeadline"
                                    value={formData.registrationDeadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <MapPin size={15} className="text-purple-400" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter tournament location"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Format */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">
                                    Tournament Format
                                </label>
                                <select
                                    name="format"
                                    value={formData.format}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    required
                                >
                                    <option value="">Select tournament format</option>
                                    {formats.map(format => (
                                        <option key={format} value={format}>{format}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Max Participants */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">
                                    Max Participants
                                </label>
                                <input
                                    type="number"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    placeholder="Maximum number of teams"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    min="2"
                                    required
                                />
                            </div>

                            {/* Min Participants */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">
                                    Min Participants
                                </label>
                                <input
                                    type="number"
                                    name="minParticipants"
                                    value={formData.minParticipants}
                                    onChange={handleChange}
                                    placeholder="Minimum number of teams"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    min="2"
                                    required
                                />
                            </div>

                            {/* Entry Fee */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <DollarSign size={15} className="text-yellow-400" />
                                    Entry Fee
                                </label>
                                <input
                                    type="number"
                                    name="entryFee"
                                    value={formData.entryFee}
                                    onChange={handleChange}
                                    placeholder="Enter minimum entry fee"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* ... keep all other inputs same as create modal ... */}

                            {/* Price Pool */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                    <Trophy size={15} className="text-amber-400" />
                                    Price Pool
                                </label>
                                <input
                                    type="number"
                                    name="pricePool"
                                    value={formData.pricePool}
                                    onChange={handleChange}
                                    placeholder="Enter price pool"
                                    className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium text-neutral-300">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description about the tournament"
                                rows={4}
                                className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                                required
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mt-4 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-neutral-700/50 hover:bg-neutral-600/50 text-white rounded-lg font-medium transition-all duration-200 border border-neutral-600/50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Update Tournament
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
