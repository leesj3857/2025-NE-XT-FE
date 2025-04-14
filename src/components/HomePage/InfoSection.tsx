import { motion } from 'framer-motion';

const InfoSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row items-start justify-between bg-[#B2BFC2] px-8 py-8 gap-8"
    >
      <img
        src="/InfoSection.webp"
        alt="Korean Food"
        loading="lazy"
        className="w-full md:w-[600px] rounded-2xl"
      />
      <div className="flex-1 md:px-12 flex flex-col items-end h-full justify-between">
        <div className="text-end">
          <h3 className="text-xl md:text-[45px] mb-4">Food Guide</h3>
          <p className="mb-20">
            Discover a variety of delicious Korean restaurants and enjoy local culinary experiences.
          </p>
        </div>
        <div className="text-end">
          <h3 className="md:text-xl mb-3 max-md:font-semibold">Recommended Travel Destinations</h3>
          <p className="mb-6">
            Explore Korea’s cultural and historical attractions, and find exciting places to visit.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default InfoSection;
