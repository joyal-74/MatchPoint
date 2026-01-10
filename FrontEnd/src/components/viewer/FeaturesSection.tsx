import { Zap, Shield, Users, Wrench, Clock, Headphones, CheckCircle2 } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Experience blazing-fast performance with real-time updates and instant match notifications.",
    },
    {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Enterprise-grade security with 99.9% uptime ensures your tournaments run smoothly.",
    },
    {
        icon: Users,
        title: "Global Community",
        description: "Connect with over 50,000 athletes and tournament organizers worldwide.",
    },
    {
        icon: Wrench,
        title: "Professional Tools",
        description: "Advanced analytics, bracket management, and customizable tournament formats.",
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description: "Access your tournaments anytime, anywhere with our cloud-based platform.",
    },
    {
        icon: Headphones,
        title: "Expert Support",
        description: "Get help from our dedicated support team of tournament management experts.",
    },
];

const FeaturesSection = () => {
    return (
        <section className="py-20 px-6 bg-background relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />

            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                        <CheckCircle2 size={14} />
                        Why Choose MatchPoint
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                        Built for <span className="text-primary">Champions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        We provide the most advanced tournament management platform with
                        features designed by athletes, for athletes. Experience the difference.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-card border border-border p-8 rounded-2xl hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="mb-6 inline-flex p-3 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <Icon size={24} />
                                </div>
                                
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;