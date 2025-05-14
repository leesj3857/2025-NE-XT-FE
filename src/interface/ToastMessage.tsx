import { AnimatePresence, motion } from 'framer-motion';

interface ToastMessageProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
}

const ToastMessage = ({ show, message, type = 'success' }: ToastMessageProps) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 text-xs md:text-sm w-fit whitespace-nowrap`}
          style={{ zIndex: 1000 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastMessage;
