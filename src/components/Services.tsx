import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: 'KOREAT: 한국 맛집과 장소 안내',
      description: '한국을 여행하거나 방문한 외국인을 위한 다양한 맛집 정보 안내.',
      image: '/Services1.jpg',
    },
    {
      title: '한국 맛집 추천: 주목해야 할 장소',
      description: '현지인이 추천하는 특별한 한식 맛집들을 소개합니다.',
      image: '/Services2.jpg',
    },
    {
      title: '한국 여행지 추천: 인기 있는 관광명소',
      description: '외국인들이 좋아할 인기 있는 한국 관광 명소를 알려드려요.',
      image: '/Services3.jpg',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#2D3433] text-white px-8 py-12 font-koreat">
      <h3 className="text-xl md:text-[45px] mb-8">서비스</h3>
      <div className="grid gap-8">
        {services.map((item, idx) => (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>
            <div key={idx} className="flex flex-col md:flex-row gap-6 bg-[#1A1E1D] rounded-lg p-4 md:w-2/3 mx-auto">
              <img src={item.image} alt={item.title} loading="lazy" className="w-full md:w-1/3 object-cover rounded-md" />
              <div className="flex-1 pt-2">
                <h4 className="text-xl mb-6">{item.title}</h4>
                <p className="tex text-gray-300">{item.description}</p>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </motion.section>
  );
};

export default Services;
