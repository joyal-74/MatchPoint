import FeaturesSection from "../../components/viewer/FeaturesSection"
import Footer from "../../components/viewer/Footer"
import Hero from "../../components/viewer/Hero"
import LiveMatchesTeaser from "../../components/viewer/LiveMatchesTeaser"
import Navbar from "../../components/viewer/Navbar"
import TrustedSection from "../../components/viewer/TrustedSection"


const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <LiveMatchesTeaser />
            <FeaturesSection />
            <TrustedSection />
            <Footer />
        </>
    )
}

export default Home