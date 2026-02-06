import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const lastUpdated = "February 06, 2026";

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 lg:p-20 font-sans selection:bg-primary/20">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Minimalist Navigation */}
                <nav className="border-b border-border pb-6 flex justify-between items-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-[10px] font-bold uppercase tracking-widest border border-input px-4 py-2 hover:bg-secondary transition-colors"
                    >
                        Back
                    </button>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                        Document ID: MP-2026-LEG
                    </span>
                </nav>

                {/* Document Title */}
                <header className="space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                        Privacy & Usage Policy
                    </h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Effective Date: {lastUpdated}
                    </p>
                </header>

                {/* Policy Body */}
                <div className="space-y-10 text-sm leading-relaxed text-foreground/90">
                    
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold uppercase tracking-tight border-l-4 border-primary pl-4">
                            01 / Introduction
                        </h2>
                        <p>
                            MatchPoint is a sports tournament management platform designed to facilitate team organization, match scheduling, and performance tracking. By accessing or using the platform, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-bold uppercase tracking-tight border-l-4 border-primary pl-4">
                            02 / Information Collection & OAuth
                        </h2>
                        <p>
                            We utilize third-party authentication services, specifically Google and Facebook Login, to verify user identity.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Identity Data:</strong> We collect your name, email address, and profile picture provided by social providers to build your athlete profile.</li>
                            <li><strong>In-App Data:</strong> We collect sports-specific details including batting style, bowling style, playing position, and jersey numbers.</li>
                            <li><strong>Infrastructure:</strong> All data is processed and stored on Digital Ocean server clusters (BLR1/NYC3 regions) to ensure low-latency access and secure data isolation.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-bold uppercase tracking-tight border-l-4 border-primary pl-4">
                            03 / Tournament Management & Roster Transparency
                        </h2>
                        <p>
                            MatchPoint functions as a public record for competitive sports. Due to the nature of tournament management:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Public Visibility:</strong> Your team affiliation, match statistics, and basic player details are visible to tournament organizers and other participants to ensure fair play.</li>
                            <li><strong>Match Records:</strong> Once match scores and performance metrics are finalized by captains or officials, they are recorded as historical tournament data and are not subject to standard user modification.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-bold uppercase tracking-tight border-l-4 border-primary pl-4">
                            04 / Facebook Data Deletion & Rights
                        </h2>
                        <p>
                            In compliance with Meta Platform Terms, we provide clear pathways for data management:
                        </p>
                        <p>
                            Users may revoke MatchPoint's access via their Facebook account settings under "Apps and Websites." If you wish to request a manual deletion of your account and all associated tournament data, you must email our support team. Upon verification, we will purge all personally identifiable information from our active databases.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-bold uppercase tracking-tight border-l-4 border-primary pl-4">
                            05 / Limitation of Liability
                        </h2>
                        <p>
                            MatchPoint serves solely as a technical management tool. We are not responsible for physical injuries, local tournament disputes, or rule enforcement at physical venues. Users participate in matches at their own risk and the risk of their respective organizers.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-bold uppercase tracking-tight border-l-4 border-primary pl-4">
                            06 / User Conduct
                        </h2>
                        <p>
                            The integrity of tournament data is paramount. Fraudulent roster entries, manipulation of scores, or harassment of other players will result in immediate suspension. We reserve the right to moderate or delete any content that disrupts the spirit of competitive integrity.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t border-border pt-12 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Technical Inquiries</p>
                            <p className="font-bold">privacy@matchpoint.com</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Governance</p>
                            <p className="font-bold">MatchPoint Sports Tech / Digital Ocean</p>
                        </div>
                    </div>
                    <p className="text-[10px] text-center opacity-40 uppercase tracking-[0.4em] pt-10">
                        © 2026 MatchPoint Sports Management System. All Rights Reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default PrivacyPolicy;