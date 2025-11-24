import { X } from "lucide-react";

interface FixtureSettings {
    matchesPerDay: number;
    startDate: string | Date;
    location: string;
}

interface ConfirmFixtureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (settings: FixtureSettings) => void;
    settings: FixtureSettings;
    setSettings: React.Dispatch<React.SetStateAction<FixtureSettings>>;
}

export default function ConfirmFixtureModal({
    isOpen,
    onClose,
    onConfirm,
    settings,
    setSettings,
}: ConfirmFixtureModalProps) {
    if (!isOpen) return null;

    const dateValue =
        settings.startDate instanceof Date
            ? settings.startDate.toISOString().split("T")[0]
            : settings.startDate
                ? settings.startDate.slice(0, 10)
                : "";

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prev) => ({
            ...prev,
            startDate: new Date(e.target.value),
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
            <div className="bg-neutral-900 text-white rounded-xl p-6 w-full max-w-md relative shadow-lg border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-semibold mb-4 text-center">
                    Confirm Fixture Generation
                </h2>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm block mb-1">Start Date</label>
                        <input
                            type="date"
                            value={dateValue}
                            onChange={handleDateChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Matches per Day</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            value={settings.matchesPerDay}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    matchesPerDay: Number(e.target.value),
                                }))
                            }
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Venue Location</label>
                        <input
                            type="text"
                            value={settings.location}
                            onChange={(e) =>
                                setSettings((prev) => ({ ...prev, location: e.target.value }))
                            }
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-neutral-700 rounded hover:bg-neutral-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() =>
                            onConfirm({
                                ...settings,
                                startDate:
                                    settings.startDate instanceof Date
                                        ? settings.startDate.toISOString()
                                        : settings.startDate,
                            })
                        }
                        className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded text-white"
                    >
                        Generate Fixtures
                    </button>
                </div>
            </div>
        </div>
    );
}
