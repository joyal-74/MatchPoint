import Navbar from '../../components/player/Navbar'
import type { ReactNode } from "react";

interface PlayerLayoutProps {
    children: ReactNode;
}

const PlayerLayoutNavbar: React.FC<PlayerLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[var(--color-background-primary)] md:pr-12">
            <div className="flex-1 flex flex-col">
                    <Navbar />
                <main className="flex-1 px-6 ml-15">{children}</main>
            </div>
        </div>
    );
};

export default PlayerLayoutNavbar;