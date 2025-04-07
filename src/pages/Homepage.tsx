import Hero from '../components/Hero';
import Services from '../components/Services';
import InfoSection from '../components/InfoSection';
import StartButton from "../components/StartButton.tsx";
export default function Homepage () {
  return (
    <div className="homepage">
      <Hero />
      <Services />
      <InfoSection />
      <StartButton />
    </div>
  )
}