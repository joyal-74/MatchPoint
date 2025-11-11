import { getFieldIcon } from "../../../utils/getFieldIcon";

interface InfoItem {
    label: string;
    value: string | number | null;
    color: string;
}

interface InfoGridProps {
    data: InfoItem[];
}

const InfoGrid = ({ data }: InfoGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="bg-neutral-700/30 rounded-lg p-3 border border-neutral-600/50 hover:border-emerald-500/30 transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-${item.color}-500/20 rounded-full flex items-center justify-center`}>
                            {getFieldIcon(item.label)}
                        </div>
                        <div>
                            <h2 className="text-xs uppercase text-neutral-400 font-semibold">
                                {item.label}
                            </h2>
                            <p className="text-base font-semibold text-neutral-100">
                                {item.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InfoGrid;