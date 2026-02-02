import { Mail, Linkedin, Instagram, Facebook } from "lucide-react";

const footerLinks = {
    quickLinks: ["Home", "Tournaments", "Live Matches", "Leaderboard", "About Us", "Contact"],
    forUsers: ["Register as Player", "Create Tournament", "Stream Your Match", "Join as Fan", "Help / FAQs"],
    resources: [
        "Blog / News",
        "Press & Media",
        "Support Center",
        "Terms of Service",
        "Privacy Policy",
        "Refund & Cancellation Policy",
    ],
};

const Footer = () => {
    return (
        <footer className="bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] pt-12 border-t border-[var(--color-border)]">
            <div className="mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-[var(--color-border)]">
                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                        <span className="text-[var(--color-primary)]">M</span>atch
                        <span className="text-[var(--color-primary)]">P</span>oint
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-xs">
                        Our platform makes it easy to host tournaments, manage teams, and engage fans with live updates,
                        streaming, and analytics. From local clubs to global leagues, we've got every match covered.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        {footerLinks.quickLinks.map((link, i) => (
                            <li key={i}>
                                <a
                                    href="#"
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* For Users */}
                <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">For Users</h3>
                    <ul className="space-y-2 text-sm">
                        {footerLinks.forUsers.map((link, i) => (
                            <li key={i}>
                                <a
                                    href="#"
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Resources & Legal */}
                <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">Resources & Legal</h3>
                    <ul className="space-y-2 text-sm">
                        {footerLinks.resources.map((link, i) => (
                            <li key={i}>
                                <a
                                    href="#"
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
                <p className="text-[var(--color-text-tertiary)] mb-4 md:mb-0">
                    © 2026 MatchPoint – Your Sports tournament manager. All Rights Reserved.
                </p>
                <div className="flex space-x-5">
                    <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200">
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200">
                        <Mail className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200">
                        <Facebook className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;