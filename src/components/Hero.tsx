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
          한국 맛집, 놀거리, 볼거리 추천
        </h2>
        <p className="mb-4 text-sm md:text-xl">
          KOREAT는 외국인을 위한 한국의 맛집, 놀거리, 볼거리를 소개하는 사이트입니다.
        </p>
      </div>
      <img src="/HeroImage.jpg" alt="Korean Meat" loading="lazy" className="w-full md:w-1/3 rounded-2xl" />
    </motion.section>
  );
};

export default Hero;