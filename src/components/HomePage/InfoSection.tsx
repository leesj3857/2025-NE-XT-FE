import { motion } from 'framer-motion';

const InfoSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row items-start justify-between bg-[#B2BFC2] px-8 py-8 gap-8">
      <img
        src="/InfoSection.webp"
        alt="Korean Food"
        loading="lazy"
        className="w-full md:w-[600px] rounded-2xl"
      />
      <div className="flex-1 md:px-12 flex flex-col items-end h-full justify-between">
        <div className="text-end">
          <h3 className="text-xl md:text-[45px] mb-4">맛집 정보</h3>
          <p className="mb-20">
            한국의 다양한 맛집을 소개하고, 맛있는 음식을 즐길 수 있는 장소를 추천합니다.
          </p>
        </div>
        <div className="text-end">
          <h3 className="md:text-xl mb-3 max-md:font-semibold">놀거리 정보</h3>
          <p className="mb-4">
            한국에서 즐길 수 있는 다양한 놀거리를 소개하고, 즐거운 시간을 보낼 수 있는 장소를 안내합니다.
          </p>

          <h3 className="md:text-xl mb-3 max-md:font-semibold">볼거리 정보</h3>
          <p className="mb-6">
            한국의 다양한 볼거리를 소개하며, 풍부한 문화와 역사를 경험할 수 있는 장소를 안내합니다.
          </p>
        </div>
      </div>

    </motion.section>
  );
};

export default InfoSection;