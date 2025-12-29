import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from "lucide-react";

export const ToastConfig = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={10}
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'hsl(var(--popover))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'calc(var(--radius) + 4px)',
                    padding: '12px 16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                },
                success: {
                    style: { border: '1px solid hsl(var(--primary) / 0.2)' },
                    iconTheme: {
                        primary: 'hsl(var(--primary))',
                        secondary: 'hsl(var(--primary-foreground))',
                    },
                },
                error: {
                    style: { border: '1px solid hsl(var(--destructive) / 0.2)' },
                    iconTheme: {
                        primary: 'hsl(var(--destructive))',
                        secondary: 'hsl(var(--destructive-foreground))',
                    },
                },
                loading: {
                    style: { border: '1px solid hsl(var(--muted))' },
                },
            }}
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <>
                            {icon}
                            <div className="flex-1 justify-center flex">
                                {message}
                            </div>
                            {t.type !== 'loading' && (
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="ml-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-l border-border pl-3 -mr-2"
                                    aria-label="Close"
                                >
                                    <X size={14} strokeWidth={2.5} />
                                </button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};