import Sidebar from "../../components/umpire/Sidebar";
import type { ReactNode } from "react";
import Navbar from "../../components/umpire/Navbar";

interface AdminLayoutProps {
    children?: ReactNode;
}

const UmpireProfileLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <Sidebar />

            <main
                className="relative flex-1 bg-background transition-all duration-300 ease-in-out pt-[60px] md:ml-16 lg:ml-60 "
            >
                <div className="p-4 md:p-6 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default UmpireProfileLayout;