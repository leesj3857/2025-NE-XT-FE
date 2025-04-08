import Hero from '../components/HomePage/Hero.tsx';
import Services from '../components/HomePage/Services.tsx';
import InfoSection from '../components/HomePage/InfoSection.tsx';
import StartButton from "../components/HomePage/StartButton.tsx";
import { useNavigate } from 'react-router-dom';
export default function Homepage () {

  const navigate = useNavigate()
  const handleStart = () => {
    navigate('/step');
  };

  return (
    <div className="homepage">
      <Hero />
      <Services />
      <InfoSection />
      <StartButton onClick={handleStart}/>
    </div>
  )
}