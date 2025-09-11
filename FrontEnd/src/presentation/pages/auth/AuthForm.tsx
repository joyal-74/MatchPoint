import React from "react";

interface AuthFormProps {
    title: string;
    subtitle?: string;
    onSubmit: (e: React.FormEvent) => void;
    buttonText: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
    title,
    subtitle,
    onSubmit,
    buttonText,
    children,
    footer
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[--text-primary] lg:px-4 lg:py-8">
            <div className="bg-[var(--color-background-secondary)] lg:rounded-xl lg:shadow-lg flex flex-col md:flex-row overflow-hidden w-full lg:max-w-6xl min-h-screen lg:min-h-[600px]">

                <div className="hidden md:block w-full md:w-1/3 bg-dark">
                    <img
                        src="/cricket-1.jpg"
                        alt="Football Player"
                        className="object-cover h-full w-full"
                    />
                </div>

                <div className="flex-1 w-full px-6 py-8 md:px-10 md:py-10 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        <h1 className="text-[var(--color-text-primary)] text-3xl md:text-4xl font-rowdies text-center mb-4">
                            <span className="text-[var(--color-primary)]">M</span>atch
                            <span className="text-[var(--color-primary)]">P</span>oint
                        </h1>
                        
                        <h3 className="text-lg md:text-xl text-center mb-6 md:mb-8">{title}</h3>
                        
                        {subtitle && (
                            <h3 className="text-sm text-center mb-8 md:mb-14 text-[--color-text-primary]">
                                {subtitle}
                            </h3>
                        )}

                        <form onSubmit={onSubmit} className="space-y-3">
                            <div className="space-y-3">
                                {children}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-[--text-primary] font-semibold py-2 px-10 rounded-md transition duration-200 min-w-[160px]"
                                >
                                    {buttonText}
                                </button>
                            </div>

                            {footer && (
                                <div className="text-center text-sm pt-4">
                                    {footer}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;