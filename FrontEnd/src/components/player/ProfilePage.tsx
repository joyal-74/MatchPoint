
const ProfilePage : React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary font-poppins p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-surface rounded-lg shadow-theme-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <div className="text-sm text-text-muted uppercase tracking-wide mb-1">Sem...jayak</div>
                            <h1 className="text-3xl font-bold text-text-primary">Joyal Kurfakose</h1>
                        </div>
                        <div className="mt-4 md:mt-0 bg-primary text-text-inverse px-4 py-2 rounded-md text-sm font-medium">
                            CRR0457834
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Sports Details */}
                    <div className="space-y-6">
                        {/* Sports Specific Details Card */}
                        <div className="bg-surface rounded-lg shadow-theme-sm border border-border p-6">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Sports Specific Details</h2>

                            <div className="space-y-4">
                                {/* Sorting Style */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Select your batting style
                                    </label>
                                    <select className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option>Right-handed</option>
                                        <option>Left-handed</option>
                                    </select>
                                </div>

                                {/* Bowling Style */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        <strong>Bowling Style</strong>
                                    </label>
                                    <select className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option>Right-arm fast</option>
                                        <option>Right-arm medium</option>
                                        <option>Left-arm fast</option>
                                        <option>Left-arm medium</option>
                                        <option>Off spin</option>
                                        <option>Leg spin</option>
                                    </select>
                                </div>

                                {/* Playing Position */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Select your playing position
                                    </label>
                                    <select className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option>Batsman</option>
                                        <option>Bowler</option>
                                        <option>All-rounder</option>
                                        <option>Wicket-keeper</option>
                                    </select>
                                </div>

                                {/* Jersey Number */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        <strong>Jersey Number</strong>
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your Jersey number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Achievements Card */}
                        <div className="bg-surface rounded-lg shadow-theme-sm border border-border p-6">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Achievements</h2>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span className="text-text-secondary">All Kerala Cricket Cup</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span className="text-text-secondary">Kings Cricket Cricket Tour</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span className="text-text-secondary">The Hundred - Kochi</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span className="text-text-secondary">The Hundred - Komtur</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Personal Details */}
                    <div className="space-y-6">
                        {/* Personal Details Card */}
                        <div className="bg-surface rounded-lg shadow-theme-sm border border-border p-6">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Personal Details</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-border-secondary">
                                    <span className="text-text-tertiary">Email</span>
                                    <span className="text-text-primary font-medium">joyalkurfakose7@gmail.com</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-border-secondary">
                                    <span className="text-text-tertiary">Phone</span>
                                    <span className="text-text-primary font-medium">+81 7303890587</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-border-secondary">
                                    <span className="text-text-tertiary">Date of Birth</span>
                                    <span className="text-text-primary font-medium">07 - 04 - 2000</span>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-text-tertiary">Gender</span>
                                    <span className="text-text-primary font-medium">Male</span>
                                </div>
                            </div>
                        </div>

                        {/* Address Details Card */}
                        <div className="bg-surface rounded-lg shadow-theme-sm border border-border p-6">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Address Details</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-border-secondary">
                                    <span className="text-text-tertiary">Address</span>
                                    <span className="text-text-primary font-medium text-right">Kochi, Ernokidam</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-border-secondary">
                                    <span className="text-text-tertiary">State</span>
                                    <span className="text-text-primary font-medium">Kerala</span>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-text-tertiary">Country</span>
                                    <span className="text-text-primary font-medium">India</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button className="btn-primary flex-1">
                                Edit Profile
                            </button>
                            <button className="btn-secondary flex-1">
                                Download Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;