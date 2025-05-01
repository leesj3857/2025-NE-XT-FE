import { motion } from 'framer-motion';

const Services = () => {

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#1A1E1D] text-white p-8 font-koreat h-[500px]"
    >
      <h3 className="text-xl md:text-[45px] mb-8">Our Services</h3>
      <div className="grid gap-8">
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-6 bg-[#1A1E1D] rounded-lg p-4 md:w-2/3 mx-auto">
            <img
              src='/Services3.webp'
              alt='Recommended Travel Destinations in Korea'
              loading="lazy"
              className="w-full md:w-1/3 object-cover rounded-md max-md:max-w-[250px] mx-auto"
            />
            <div className="flex-1 pt-2">
              <h4 className="text-xl mb-6">Recommended Travel Destinations in Korea</h4>
              <p className="text-gray-300">Explore popular tourist spots in Korea that are loved by foreigners.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.section>
  );
};

export default Services;
