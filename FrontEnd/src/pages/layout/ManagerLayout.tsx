import React, { type ReactNode } from "react";
import Sidebar from "../../components/manager/Sidebar";
import Navbar from '../../components/manager/Navbar';

interface ManagerLayoutProps {
    children?: ReactNode;
}

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
    return (
        <div className="bg-background text-foreground">
            <Navbar />

            <Sidebar />

            <main
                className="relative flex-1 bg-background transition-all duration-300 ease-in-out md:ml-16 lg:ml-60 "
            >
                <div className="p-4 md:p-6 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ManagerLayout;