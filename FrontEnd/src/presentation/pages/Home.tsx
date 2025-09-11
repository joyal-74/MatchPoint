import FeaturesSection from "../roles/viewer/Components/FeaturesSection"
import Hero from "../roles/viewer/Components/Hero"
import LiveMatches from "../roles/viewer/Components/LiveMatches"
import TrustedSection from "../roles/viewer/Components/TrustedSection"
import Footer from "./Footer"
import Navbar from "./Navbar"

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <LiveMatches />
            <FeaturesSection/>
            <TrustedSection />
            <Footer/>
        </>
    )
}

export default Home