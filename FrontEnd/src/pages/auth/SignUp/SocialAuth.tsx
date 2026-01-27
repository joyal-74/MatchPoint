import FacebookLogin from "@greatsumini/react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import { FaChrome, FaFacebookF } from "react-icons/fa";

interface SocialAuthProps {
    onGoogle: (code: string) => void;
    onFacebook: (accessToken: string) => void;
}

const SocialAuth = ({ onGoogle, onFacebook }: SocialAuthProps) => {
    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            onGoogle(codeResponse.code);
        },
        onError: (error) => {
            console.error('Google OAuth error:', error);
        },
        flow: 'auth-code',
        scope: 'openid email profile',
    });

    return (
        <div className="mt-8 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <button onClick={() => googleLogin()} type="button" className="flex items-center justify-center gap-2 bg-background border border-input h-12 rounded-xl text-xs font-bold hover:bg-muted transition-all active:scale-95">
                <FaChrome className="w-4 h-4 text-[#ea4335]" /> Google
            </button>
            <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                onSuccess={(response) => {
                    if (response?.accessToken) {
                        onFacebook(response.accessToken);
                    }
                }}
                onFail={(error) => console.error("Facebook login error:", error)}
                render={({ onClick }) => (
                    <button
                        onClick={onClick}
                        type="button"
                        className="flex items-center justify-center gap-2 bg-background border border-input h-12 rounded-xl text-xs font-bold hover:bg-muted transition-all active:scale-95 shadow-sm"
                    >
                        <FaFacebookF className="w-4 h-4 text-[#1877f2]" />
                        Facebook
                    </button>
                )}
            />
        </div>
    )
};

export default SocialAuth;