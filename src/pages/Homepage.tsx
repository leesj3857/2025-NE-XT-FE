import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/HomePage/Hero.tsx';
import Services from '../components/HomePage/Services.tsx';
import Services1 from '../components/HomePage/Services1.tsx';
import Services2 from '../components/HomePage/Services2.tsx';
import InfoSection from '../components/HomePage/InfoSection.tsx';
import StartButton from '../components/HomePage/StartButton.tsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Homepage() {
  const navigate = useNavigate();
  const handleStart = () => navigate('/step');

  const slides = [
    <Hero key="hero" />,
    <Services1 key="services1" />,
    <Services2 key="services2" />,
    <InfoSection key="info" />,
  ];
  const [currentIndex, setCurrentIndex] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const renderSlide = () => {
    switch (currentIndex) {
      case 0: return <Hero />;
      case 1: return <Services1 />;
      case 2: return <Services2 />;
      case 3: return <InfoSection />;
      default: return null;
    }
  };

  return (
    <>
      <div className="md:hidden flex flex-col items-center w-full h-full bg-[#DCE7EB] homepage">
        {/* 슬라이드 영역 */}
        <div className="relative w-full h-[500px] overflow-hidden">
          {/*<SlideProgressBar keyTrigger={currentIndex} duration={4950} />*/}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>

          {/* dot indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-[#FF6B6B] scale-125' : 'bg-[#F7CAC9]'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Start 버튼 */}
        <div className="w-full">
          <StartButton onClick={handleStart} />
        </div>
      </div>

      <div className="hidden md:block homepage">
        <Hero />
        <Services />
        <InfoSection />
        <StartButton onClick={handleStart} />
      </div>
    </>
  );
}
