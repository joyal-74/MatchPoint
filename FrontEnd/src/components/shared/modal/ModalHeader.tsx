import { X } from "lucide-react";

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
    disabled?: boolean;
}

export default function ModalHeader({ title, onClose, disabled }: ModalHeaderProps) {
    return (
        <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-700">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button 
                onClick={onClose} 
                disabled={disabled}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
                <X size={20} className="text-neutral-400" />
            </button>
        </div>
    );
}