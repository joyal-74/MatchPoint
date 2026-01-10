import { X, ExternalLink, Info } from "lucide-react";

interface PrizeInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrizeInfoModal = ({ isOpen, onClose }: PrizeInfoModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl backdrop-blur-2xl">

                    {/* Header */}
                    <div className="p-6 border-b border-border">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">Prize Pool & Fee Distribution</h2>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Quick Overview of financial breakdowns</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Prize Pool Section - Green */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-green-500 rounded-full"></div>
                                <h3 className="text-green-600 dark:text-green-400 font-semibold text-lg">Prize Pool</h3>
                            </div>
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 h-full">
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    <span className="text-green-700 dark:text-green-400 font-bold">70% of entry fees</span> are allocated to the prize pool, distributed among:
                                </p>
                                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        1st Prize
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        2nd Prize
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        Player of the Tournament
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Fee Distribution Section - Blue */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                                <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg">Fee Distribution</h3>
                            </div>
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 h-full">
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    <span className="text-blue-700 dark:text-blue-400 font-bold">30% of entry fees</span> are allocated to manager and admin shares:
                                </p>
                                <div className="space-y-3">
                                    <div className="p-2 rounded bg-background/50 border border-border/50">
                                        <h4 className="text-blue-600 dark:text-blue-300 font-medium text-sm mb-1">Standard Tournaments</h4>
                                        <p className="text-muted-foreground text-xs">50% Manager / 50% Admin</p>
                                    </div>
                                    <div className="p-2 rounded bg-background/50 border border-border/50">
                                        <h4 className="text-amber-600 dark:text-amber-300 font-medium text-sm mb-1">Premium Subscription</h4>
                                        <p className="text-muted-foreground text-xs">80% Manager / 20% Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Automatic System Section - Purple */}
                        <div className="md:col-span-2 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-purple-500 rounded-full"></div>
                                <h3 className="text-purple-600 dark:text-purple-400 font-semibold text-lg">Automatic System</h3>
                            </div>
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    All calculations and distributions are handled automatically via the platform wallet. No manual collection needed.
                                </p>
                                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-2">
                                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <p className="text-amber-700 dark:text-amber-300 text-xs font-medium">
                                        Ensure entry fees are correct for accurate prize pool calculation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Minimum Price Pool Section - Yellow */}
                        <div className="space-y-3 md:col-span-2">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                                <h3 className="text-amber-600 dark:text-amber-400 font-semibold text-lg">Minimum Price Pool</h3>
                            </div>
                            <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    The prize pool displayed depends on the number of participants. A <span className="text-amber-600 dark:text-amber-400 font-bold">minimum prize pool</span> is guaranteed based on the <span className="text-amber-600 dark:text-amber-400 font-bold">minimum required teams</span> and the entry fee.
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc list-inside">
                                    <li>Minimum Price Pool = minTeams × entry fee</li>
                                    <li>Example: minTeams = 12, entry fee = ₹1000 → minimum prize pool = ₹12,000</li>
                                    <li>As more teams register, the prize pool increases: registeredTeams × entry fee × 70%</li>
                                </ul>
                                <p className="text-muted-foreground/70 text-xs mt-3 italic">
                                    This ensures the tournament payouts remain fair and feasible, even with fewer participants.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-muted/20 rounded-b-xl">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium border border-border"
                            >
                                Got it
                            </button>
                            <button className="text-primary hover:text-primary/80 transition-colors font-medium text-sm flex items-center gap-2">
                                <span>Learn More </span>
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrizeInfoModal;