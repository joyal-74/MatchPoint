import { Zap, Shield, Users, Wrench, Clock, Headphones } from "lucide-react";

const features = [
    {
        icon: <Zap className="text-[var(--color-primary)] w-10 h-10" />,
        title: "Lightning Fast",
        description: "Experience blazing-fast performance with real-time updates and instant match notifications.",
    },
    {
        icon: <Shield className="text-[var(--color-primary)] w-10 h-10" />,
        title: "Secure & Reliable",
        description: "Enterprise-grade security with 99.9% uptime ensures your tournaments run smoothly.",
    },
    {
        icon: <Users className="text-[var(--color-primary)] w-10 h-10" />,
        title: "Global Community",
        description: "Connect with over 50,000 athletes and tournament organizers worldwide.",
    },
    {
        icon: <Wrench className="text-[var(--color-primary)] w-10 h-10" />,
        title: "Professional Tools",
        description: "Advanced analytics, bracket management, and customizable tournament formats.",
    },
    {
        icon: <Clock className="text-[var(--color-primary)] w-10 h-10" />,
        title: "24/7 Availability",
        description: "Access your tournaments anytime, anywhere with our cloud-based platform.",
    },
    {
        icon: <Headphones className="text-[var(--color-primary)] w-10 h-10" />,
        title: "Expert Support",
        description: "Get help from our dedicated support team of tournament management experts.",
    },
];

const FeaturesSection = () => {
    return (
        <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto text-center">

                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                    Built for <span className="text-[var(--color-primary)]">Champions</span>
                </h2>
                <p className="text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-12 text-lg">
                    We provide the most advanced tournament management platform with
                    features designed by athletes, for athletes. Experience the difference.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[var(--color-surface)] p-8 rounded-xl shadow-[var(--shadow-md)] border border-[var(--color-border)] hover:scale-101 hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-primary)]/30 transition-all duration-300 group"
                        >
                            <div className="flex justify-center mb-4 transform group-hover:scale-101 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-[var(--color-text-primary)] text-xl font-semibold mb-3 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;