import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage : React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="max-w-md w-full text-center">

                <div className="relative mb-8">
                    <div className="text-9xl font-bold text-primary opacity-10 select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-theme-lg">
                            <svg
                                className="w-16 h-16 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>


                <div className="space-y-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-text-primary">
                            Page Not Found
                        </h1>
                        <p className="text-lg text-text-tertiary leading-relaxed">
                            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered an incorrect URL.
                        </p>
                    </div>


                    <div className="bg-surface border border-border rounded-lg p-4 shadow-theme-sm">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-primary">404</div>
                                <div className="text-xs text-text-muted uppercase tracking-wide">Error Code</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-warning">!</div>
                                <div className="text-xs text-text-muted uppercase tracking-wide">Status</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-info">?</div>
                                <div className="text-xs text-text-muted uppercase tracking-wide">Help</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            to="/"
                            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Back to Homepage
                        </Link>

                        <button
                            onClick={() => navigate(-1)}
                            className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go Back
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;