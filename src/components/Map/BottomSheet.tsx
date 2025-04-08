import { useState } from 'react';
import { motion } from 'framer-motion';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';

const BottomSheet = ({ dummyPlaces }: { dummyPlaces: any[] }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-xl rounded-t-xl z-50 pt-2 px-4">
      {/* 바텀시트 내부의 화살표 토글 */}
      <div onClick={toggleOpen} className="w-full flex justify-center mb-2 ">
        <button >
          <Icon path={isOpen ? mdiChevronDown : mdiChevronUp} size={1} />
        </button>
      </div>

      {/* 컨텐츠 */}
      {isOpen && (
        <>
          <h2 className="text-lg font-semibold mb-2">추천 장소</h2>
          <ul className="space-y-3 max-h-[50vh] overflow-auto">
            {dummyPlaces.map((place, index) => (
              <motion.li
                key={place.id}
                className="bg-[#E9F1F4] p-3 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-bold text-base mb-1">{place.name}</h3>
                <p className="text-sm">{place.description}</p>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default BottomSheet;