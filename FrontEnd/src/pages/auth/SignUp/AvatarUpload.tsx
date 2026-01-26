import { Camera, Check } from "lucide-react";

interface AvatarUploadProps {
    preview: string | null;
    error?: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload = ({ preview, error, onImageChange }: AvatarUploadProps) => (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${error ? 'bg-destructive/5 border-destructive' : 'bg-muted/30 border-border/50'}`}>
        <div className="relative shrink-0" onClick={() => document.getElementById('avatar-upload')?.click()}>
            <div className={`w-16 h-16 rounded-full border-2 overflow-hidden bg-background flex items-center justify-center cursor-pointer transition-all ${error ? 'border-destructive' : preview ? 'border-green-500' : 'border-primary/20 hover:border-primary'}`}>
                {preview ? <img src={preview} alt="Avatar" className="w-full h-full object-cover" /> : <Camera className={`w-6 h-6 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />}
            </div>
            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-card shadow-sm ${preview ? 'bg-green-500' : 'bg-primary'}`}>
                <Check className="w-2.5 h-2.5 text-white" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-bold truncate ${error ? 'text-destructive' : 'text-foreground'}`}>Identity Photo</h4>
            <p className="text-[11px] text-muted-foreground leading-tight">{error || "Click to upload your profile picture."}</p>
            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={onImageChange} />
        </div>
    </div>
);

export default AvatarUpload;