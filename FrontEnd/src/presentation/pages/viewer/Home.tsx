import FeaturesSection from "../../components/viewer/FeaturesSection"
import Hero from "../../components/viewer/Hero"
import LiveMatches from "../../components/viewer/LiveMatches"
import TrustedSection from "../../components/viewer/TrustedSection"
import Footer from "../../components/viewer/Footer"
import Navbar from "../../components/viewer/Navbar"

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