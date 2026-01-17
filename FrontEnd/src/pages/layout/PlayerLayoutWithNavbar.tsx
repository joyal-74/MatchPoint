import Navbar from '../../components/player/Navbar'
import type { ReactNode } from "react";

interface PlayerLayoutProps {
    children: ReactNode;
}

const PlayerLayoutNavbar: React.FC<PlayerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="flex-1 flex flex-col">
                    <Navbar />
                <main className="flex-1 px-6 ml-15">{children}</main>
            </div>
        </div>
    );
};

export default PlayerLayoutNavbar;