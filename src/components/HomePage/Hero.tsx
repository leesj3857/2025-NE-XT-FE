import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row items-start justify-between bg-[#CBCCCC] px-8 py-16 gap-8">
      <div className="flex-1 ">
        <h2 className="text-xl md:text-[45px] mb-10">
          Discover Korea’s Best Food and Attractions
        </h2>
        <p className="mb-4 text-sm md:text-xl">
          KOREAT is a platform that introduces the best restaurants and must-see spots in Korea for foreigners.
        </p>
      </div>
      <img src="/HeroImage.webp" alt="Korean Meat" loading="lazy" className="w-full md:w-1/3 rounded-2xl" />
    </motion.section>
  );
};

export default Hero;