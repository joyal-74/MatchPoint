import { X, Camera } from "lucide-react";
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
            <div className="relative">
                <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Team logo" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-neutral-500 text-sm text-center">No Logo</div>
                    )}
                </div>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    disabled={disabled}
                />
                <label 
                    htmlFor="logo-upload" 
                    className="absolute -bottom-1 -right-1 p-1 bg-green-600 rounded-full cursor-pointer hover:bg-green-700 transition-colors"
                >
                    <Camera size={14} className="text-white" />
                </label>
                
                {logoPreview && (
                    <button 
                        type="button" 
                        onClick={onLogoRemove}
                        disabled={disabled}
                        className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                    >
                        <X size={12} className="text-white" />
                    </button>
                )}
            </div>
            <div>
                <p className="text-white text-sm">Team Logo</p>
                <p className="text-neutral-400 text-xs">Required • Max 5MB</p>
            </div>
        </div>
    );
}