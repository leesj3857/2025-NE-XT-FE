import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepOne from '../components/Step/StepOne';
import StepTwo from '../components/Step/StepTwo';
import StepThree from '../components/Step/StepThree';
import StepSummary from '../components/Step/StepSummary';
const StepProgress = ({ current, total }: { current: number; total: number }) => {
  return (
    <div className="absolute top-2 right-1/2 translate-x-1/2 md:top-4  flex gap-2">
      {[...Array(total)].map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${i < current ? 'bg-[#2D3433]' : 'bg-[#B2BFC2]'} transition-all`}
        />
      ))}
    </div>
  );
};

const Step = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = 앞으로, -1 = 뒤로

  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [categories, setCategories] = useState({ food: false, sights: false });

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const slideVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="bg-[#DCE7EB] max-md:h-[calc(100dvh-96px)] h-[calc(100dvh-128px)] p-6 flex items-center justify-center">
      <div className="w-full md:w-xl mx-auto bg-white rounded-xl shadow-lg pt-16 p-10 px-6 relative max-md:h-5/6 md:-translate-y-1/2">
        <StepProgress current={step} total={4} />

        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <StepOne city={city} setCity={setCity} onNext={nextStep} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <StepTwo region={region} setRegion={setRegion} onNext={nextStep} onBack={prevStep} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <StepThree categories={categories} setCategories={setCategories} onNext={nextStep} onBack={prevStep}  />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <StepSummary city={city} region={region} categories={categories} onBack={prevStep} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Step;