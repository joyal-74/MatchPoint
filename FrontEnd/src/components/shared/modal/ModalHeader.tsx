import { X } from "lucide-react";

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
    disabled?: boolean;
}

export default function ModalHeader({ title, onClose, disabled }: ModalHeaderProps) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <button 
                onClick={onClose} 
                disabled={disabled}
                className="p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                aria-label="Close modal"
            >
                <X size={20} />
            </button>
        </div>
    );
}