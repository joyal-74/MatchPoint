import { X, Camera, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

interface LogoUploadProps {
    logoPreview: string;
    onLogoChange: (file: File) => void;
    onLogoRemove: () => void;
    disabled?: boolean;
}

export default function LogoUpload({ 
    logoPreview, 
    onLogoChange, 
    onLogoRemove, 
    disabled 
}: LogoUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onLogoChange(file);
        }
    };

    return (
        <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
                {/* Avatar Circle */}
                <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden transition-colors">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Team logo" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                            <ImageIcon size={20} />
                        </div>
                    )}
                </div>
                
                {/* File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    disabled={disabled}
                />

                {/* Upload Button (Primary) */}
                <label 
                    htmlFor="logo-upload" 
                    className={`
                        absolute -bottom-1 -right-1 p-1.5 rounded-full cursor-pointer transition-all shadow-sm border border-background
                        bg-primary text-primary-foreground hover:bg-primary/90
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                    `}
                    title="Upload Logo"
                >
                    <Camera size={14} />
                </label>
                
                {/* Remove Button (Destructive) */}
                {logoPreview && (
                    <button 
                        type="button" 
                        onClick={onLogoRemove}
                        disabled={disabled}
                        className={`
                            absolute -top-1 -right-1 p-1.5 rounded-full transition-all shadow-sm border border-background
                            bg-destructive text-destructive-foreground hover:bg-destructive/90
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                        `}
                        title="Remove Logo"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>

            {/* Text Labels */}
            <div>
                <p className="text-foreground font-medium text-sm">Team Logo</p>
                <p className="text-muted-foreground text-xs mt-0.5">Required • Max 5MB</p>
            </div>
        </div>
    );
}