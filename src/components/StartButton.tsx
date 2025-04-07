import { motion } from 'framer-motion';

const StartButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-start justify-between bg-[#DCE7EB] p-8 md:py-16 gap-8">

      {/* 상단 텍스트 */}
      <div className="text-left">
        <h2 className="text-xl md:text-[45px] mb-4">시작하기</h2>
        <p className="text-sm md:text-lg">KOREAT의 세계로 들어가 다양한 한국의 맛과 문화를 탐험해보세요.</p>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full flex justify-center">
        <button
          onClick={onClick}
          className="bg-[#2D3433] text-white text-lg font-semibold px-12 py-4 rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          시작하기
        </button>
      </div>
    </motion.section>
  );
};

export default StartButton;