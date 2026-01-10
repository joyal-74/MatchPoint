import Sidebar from "../../components/manager/Sidebar";
import Navbar from '../../components/manager/Navbar'
import type { ReactNode } from "react";

interface PlayerLayoutProps {
    children?: ReactNode;
}

const ManagerLayout: React.FC<PlayerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <div className="ml-60">
                    <Navbar />
                </div>

                <main className="flex-1 px-6 ml-15 lg:ml-70">{children}</main>
            </div>
        </div>
    );
};

export default ManagerLayout;