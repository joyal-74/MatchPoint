interface PrizeInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrizeInfoModal = ({ isOpen, onClose }: PrizeInfoModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl backdrop-blur-2xl">

                    {/* Header */}
                    <div className="p-6 border-b border-neutral-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Prize Pool & Fee Distribution</h2>
                            <button
                                onClick={onClose}
                                className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-neutral-400 mt-2">Quick Overview</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Prize Pool Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                <h3 className="text-green-400 font-semibold text-lg">Prize Pool</h3>
                            </div>
                            <div className="bg-neutral-800 rounded-lg p-4">
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    <span className="text-green-400 font-semibold">70% of entry fees</span> are allocated to the prize pool, distributed among:
                                </p>
                                <ul className="mt-5 space-y-3 text-sm text-neutral-300">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-green-400 rounded-full"></div>1st Prize</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-green-400 rounded-full"></div>2nd Prize</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-green-400 rounded-full"></div>Player of the Tournament</li>
                                </ul>
                            </div>
                        </div>

                        {/* Fee Distribution Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                                <h3 className="text-blue-400 font-semibold text-lg">Fee Distribution</h3>
                            </div>
                            <div className="bg-neutral-800 rounded-lg p-4">
                                <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                                    <span className="text-blue-400 font-semibold">30% of entry fees</span> are allocated to manager and admin shares:
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-blue-300 font-medium text-sm mb-1">Standard Tournaments</h4>
                                        <p className="text-neutral-400 text-xs">50% Manager / 50% Admin</p>
                                    </div>
                                    <div>
                                        <h4 className="text-yellow-300 font-medium text-sm mb-1">Premium Subscription</h4>
                                        <p className="text-neutral-400 text-xs">50% Manager / 20% Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Automatic System Section (Full Width) */}
                        <div className="md:col-span-2 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                                <h3 className="text-purple-400 font-semibold text-lg">Automatic System</h3>
                            </div>
                            <div className="bg-neutral-800 rounded-lg p-4">
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    All calculations and distributions are handled automatically. No manual collection needed.
                                </p>
                                <div className="mt-3 p-3 bg-neutral-700/50 rounded-lg">
                                    <p className="text-yellow-400 text-xs font-medium">
                                        💡 Ensure entry fees are correct for accurate prize pool calculation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Minimum Price Pool Section */}
                        <div className="space-y-3 md:col-span-2">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
                                <h3 className="text-yellow-400 font-semibold text-lg">Minimum Price Pool</h3>
                            </div>
                            <div className="bg-neutral-800 rounded-lg p-4">
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    The prize pool displayed depends on the number of participants. A <span className="text-yellow-400 font-semibold">minimum prize pool</span> is guaranteed based on the <span className="text-yellow-400 font-semibold">minimum required teams</span> and the entry fee.
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                                    <li>Minimum Price Pool = minTeams × entry fee</li>
                                    <li>Example: minTeams = 12, entry fee = ₹1000 → minimum prize pool = ₹12,000</li>
                                    <li>As more teams register, the prize pool increases: registeredTeams × entry fee × 70%</li>
                                </ul>
                                <p className="text-neutral-400 text-xs mt-2">
                                    This ensures the tournament payouts remain fair and feasible, even with fewer participants.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-neutral-700 bg-neutral-800/50 rounded-b-xl">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-colors font-medium"
                            >
                                Got it
                            </button>
                            <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm flex items-center gap-2">
                                <span>Learn More </span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrizeInfoModal;