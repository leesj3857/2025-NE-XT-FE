import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: 'Top Korean Restaurants You Shouldn’t Miss',
      description: 'Featuring special Korean restaurants loved and recommended by locals.',
      image: '/Services1.webp',
    },
    {
      title: 'Recommended Travel Destinations in Korea',
      description: 'Explore popular tourist spots in Korea that are loved by foreigners.',
      image: '/Services3.webp',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#2D3433] text-white px-8 py-12 font-koreat"
    >
      <h3 className="text-xl md:text-[45px] mb-8">Our Services</h3>
      <div className="grid gap-8">
        {services.map((item, idx) => (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            key={idx}
          >
            <div className="flex flex-col md:flex-row gap-6 bg-[#1A1E1D] rounded-lg p-4 md:w-2/3 mx-auto">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full md:w-1/3 object-cover rounded-md"
              />
              <div className="flex-1 pt-2">
                <h4 className="text-xl mb-6">{item.title}</h4>
                <p className="text-gray-300">{item.description}</p>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </motion.section>
  );
};

export default Services;
