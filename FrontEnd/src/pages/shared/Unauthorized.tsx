import { Link } from 'react-router-dom';
import { Lock, Home } from 'lucide-react';

const Unauthorized: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground transition-colors duration-300">
            <div className="text-center max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-xl animate-in zoom-in-95 duration-300">
                
                {/* Icon Bubble - Uses Destructive color for 'Denied' context */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full mb-6 ring-1 ring-destructive/20">
                    <Lock className="w-10 h-10 text-destructive" />
                </div>

                <h1 className="text-3xl font-bold mb-3 tracking-tight text-foreground">
                    Access Denied
                </h1>
                
                <p className="text-muted-foreground mb-8 leading-relaxed">
                    You don't have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-200 shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Home size={18} />
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;