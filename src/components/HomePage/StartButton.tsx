import { motion } from 'framer-motion';

const StartButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-start justify-between bg-[#DCE7EB] p-8 md:py-16 gap-8"
    >
      {/* Header Text */}
      <div className="text-left">
        <h2 className="text-xl md:text-[45px] mb-4">Get Started</h2>
        <p className="text-sm md:text-lg">
          Step into the world of KOREAT and explore the rich flavors and culture of Korea.
        </p>
      </div>

      {/* Button Area */}
      <div className="w-full flex justify-center">
        <button
          onClick={onClick}
          className="bg-[#2D3433] text-white text-lg font-semibold px-12 py-4 rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          Start Now
        </button>
      </div>
    </motion.section>
  );
};

export default StartButton;
