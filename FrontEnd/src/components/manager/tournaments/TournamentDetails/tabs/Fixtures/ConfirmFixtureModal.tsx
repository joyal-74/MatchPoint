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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[999]">
            <div className="bg-card text-foreground rounded-xl p-6 w-full max-w-md relative shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-semibold mb-4 text-center">
                    Confirm Fixture Generation
                </h2>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium block mb-1 text-muted-foreground">Start Date</label>
                        <input
                            type="date"
                            value={dateValue}
                            onChange={handleDateChange}
                            className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-input"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1 text-muted-foreground">Matches per Day</label>
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
                            className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-input"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1 text-muted-foreground">Venue Location</label>
                        <input
                            type="text"
                            value={settings.location}
                            onChange={(e) =>
                                setSettings((prev) => ({ ...prev, location: e.target.value }))
                            }
                            className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-input"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors border border-border"
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
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded font-medium shadow-md shadow-primary/20 transition-all active:scale-95"
                    >
                        Generate Fixtures
                    </button>
                </div>
            </div>
        </div>
    );
}