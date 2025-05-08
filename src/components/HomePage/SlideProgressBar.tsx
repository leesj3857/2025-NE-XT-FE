import { motion } from 'framer-motion';

interface SlideProgressBarProps {
  duration?: number; // ms
  keyTrigger: number; // 변경 시 progress 초기화
}

const SlideProgressBar = ({ duration = 5000, keyTrigger }: SlideProgressBarProps) => {
  return (
    <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-200 z-20 overflow-hidden">
      <motion.div
        key={keyTrigger} // 슬라이드 index가 변경되면 리셋
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className="h-full bg-[#8D6E63]"
      />
    </div>
  );
};

export default SlideProgressBar;
