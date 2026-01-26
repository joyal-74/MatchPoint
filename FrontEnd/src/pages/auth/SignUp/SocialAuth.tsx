import { FaChrome, FaFacebookF } from "react-icons/fa";

const SocialAuth = ({ onGoogle }: { onGoogle: (t: string) => void }) => (
    <div className="mt-8 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <button onClick={() => onGoogle('t')} type="button" className="flex items-center justify-center gap-2 bg-background border border-input h-12 rounded-xl text-xs font-bold hover:bg-muted transition-all active:scale-95">
            <FaChrome className="w-4 h-4 text-[#ea4335]" /> Google
        </button>
        <button type="button" className="flex items-center justify-center gap-2 bg-background border border-input h-12 rounded-xl text-xs font-bold hover:bg-muted transition-all active:scale-95">
            <FaFacebookF className="w-4 h-4 text-[#1877f2]" /> Facebook
        </button>
    </div>
);

export default SocialAuth;