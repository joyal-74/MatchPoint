import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description?: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    title,
    description,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            
            {/* Modal Content */}
            <div 
                className="bg-popover text-popover-foreground rounded-xl shadow-2xl w-full max-w-md border border-border animate-in zoom-in-95 duration-200 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        Confirm Deletion
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <h4 className="font-medium text-foreground text-lg mb-2">{title}</h4>
                    {description && (
                        <div className="text-muted-foreground text-sm leading-relaxed">
                            {description}
                        </div>
                    )}
                    
                    <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3 items-start">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-xs text-destructive font-medium">
                            This action cannot be undone. This item will be permanently removed from the system.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-muted/20 border-t border-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
};