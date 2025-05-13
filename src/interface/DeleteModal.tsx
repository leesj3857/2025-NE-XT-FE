// src/components/common/ConfirmModal.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DeleteModalProps {
  show: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: (reason?: string) => void;
  cancelText?: string;
  confirmText?: string;
  showReasonInput?: boolean;
  reasonPlaceholder?: string;
}

const DeleteModal = ({
  show,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Delete',
  showReasonInput = false,
  reasonPlaceholder = '신고 사유를 입력해주세요',
}: DeleteModalProps) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (show && event.key === 'Enter') {
        onConfirm(reason);
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [show, onConfirm, reason]);

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-4 text-sm md:text-base">{message}</p>
            
            {showReasonInput && (
              <div className="mb-4">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={reasonPlaceholder}
                  className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  rows={3}
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-all"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
