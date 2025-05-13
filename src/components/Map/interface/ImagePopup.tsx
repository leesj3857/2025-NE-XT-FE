import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiClose, mdiDelete } from '@mdi/js';

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onDelete?: () => void;
  isEditMode?: boolean;
}

const ImagePopup = ({ isOpen, onClose, imageUrl, onDelete, isEditMode = false }: ImagePopupProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        style={{ zIndex: 200 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 300,
            duration: 0.25
          }}
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt="Enlarged preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
          >
            <Icon path={mdiClose} size={0.9} />
          </button>

          {/* 삭제 버튼 (편집 모드일 때만 표시) */}
          {isEditMode && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                onClose();
              }}
              className="absolute top-2 left-2 p-2 bg-red-500 bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            >
              <Icon path={mdiDelete} size={1} />
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImagePopup; 