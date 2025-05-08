// src/components/Modals/SavePlaceModal.tsx
import React from 'react';
import { PlaceItemType } from '../../../types/place/type';
import { motion } from 'framer-motion';

interface SavePlaceModalProps {
  place: PlaceItemType;
  onClose: () => void;
}

const SavePlaceModal = ({ place, onClose }: SavePlaceModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">📌 Save Place</h2>
        <p className="text-sm text-gray-600 mb-2">
          Do you want to save <strong>{place.placeName}</strong>?
        </p>

        {/* 여기에 저장 리스트나 태그 선택 등의 기능 삽입 가능 */}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // 저장 로직 연결 가능
              onClose();
            }}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SavePlaceModal;
