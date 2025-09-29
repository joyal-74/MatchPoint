import { Award } from "lucide-react";

interface PremiumCardProps {
    title?: string;
    description?: string;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
    title = "Upgrade to Premium",
    description = "Upgrade to premium to get all exclusive features",
}) => (
    <div className="relative overflow-hidden rounded-xl p-6"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)" }}
    >
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-white text-lg font-semibold mb-1">{title}</h3>
                <p className="text-white text-opacity-80 text-sm">{description}</p>
            </div>
            <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-300 mr-2" />
            </div>
        </div>
    </div>
);

export default PremiumCard;