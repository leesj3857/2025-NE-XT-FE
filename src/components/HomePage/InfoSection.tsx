import { motion } from 'framer-motion';

const InfoSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col-reverse md:flex-row items-start justify-between bg-[#CBCCCC] px-8 pt-8 h-[500px] gap-4"
    >
      <div className="flex-1 flex flex-col items-start">
        <div className="">
          <h3 className="text-xl md:text-[45px] mb-4 font-semibold">Food Guide</h3>
          <p className="mb-4">
            Discover a variety of delicious Korean restaurants and enjoy local culinary experiences.
          </p>
        </div>
        <div className="">
          <h3 className="md:text-xl mb-3 font-semibold">Recommended Travel Destinations</h3>
          <p className="mb-6">
            Explore Korea’s cultural and historical attractions, and find exciting places to visit.
          </p>
        </div>
      </div>
      <img
        src="/InfoSection.webp"
        alt="Korean Food"
        loading="lazy"
        className="max-md:mx-auto max-md:max-w-[350px] max-md:w-4/5 md:w-1/4 md:min-w-[300px] lg:min-w-[400px] rounded-2xl"
      />
    </motion.section>
  );
};

export default InfoSection;
