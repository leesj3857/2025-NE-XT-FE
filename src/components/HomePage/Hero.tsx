import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row items-start md:justify-between bg-[#CBCCCC] p-8  gap-8 h-[500px]">
      <div>
        <h2 className="text-xl md:text-[45px] mb-10">
          Discover Korea’s Best Food and Attractions
        </h2>
        <p className="text-sm md:text-lg">
          The name <strong>KOREAT</strong> combines <strong>KOR</strong> (Korea), <strong>E</strong> (Eat), <strong>A</strong> (And), and <strong>T</strong> (Travel) to reflect our mission of connecting you with Korean food and cultural experiences.
        </p>
      </div>
      <img src="/HeroImage.webp" alt="Korean Meat" loading="lazy" className="max-md:mx-auto max-md:max-w-[350px] max-md:w-4/5 md:w-1/4 md:min-w-[300px] lg:min-w-[400px] rounded-2xl" />
    </motion.section>
  );
};

export default Hero;
