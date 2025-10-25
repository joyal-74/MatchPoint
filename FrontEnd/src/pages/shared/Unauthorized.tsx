import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                    Access Denied
                </h1>
                <p className="text-text-secondary mb-6">
                    You don't have permission to access this page.
                </p>
                <Link
                    to="/"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;