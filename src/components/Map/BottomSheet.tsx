import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import Pagination from './Pagination';

interface BottomSheetProps {
  results: { id: string; place_name: string; address_name: string }[];
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const BottomSheet = ({ results, currentPage, totalCount, onPageChange }: BottomSheetProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const listRef = useRef<HTMLUListElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [currentPage]);
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-xl rounded-t-xl z-50 pt-2 px-4">
      {/* 바텀시트 내부의 화살표 토글 */}
      <div onClick={toggleOpen} className="w-full flex justify-center h-12">
        <button >
          <Icon path={isOpen ? mdiChevronDown : mdiChevronUp} size={1.2} />
        </button>
      </div>

      {/* 컨텐츠 */}
      {isOpen && (
        <>
          <h2 className="text-lg font-semibold mb-2">추천 장소</h2>
          <ul ref={listRef}
              className="space-y-3 max-h-[40vh] mb-16 overflow-auto">
            {results.map((place, index) => (
              <motion.li
                key={place.id}
                className="bg-[#E9F1F4] p-3 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-bold text-base mb-1">{place.place_name}</h3>
                <p className="text-sm">{place.address_name}</p>
              </motion.li>
            ))}
          </ul>

          {totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              itemsPerPage={10}
              onPageChange={onPageChange}
            />
          )}

        </>
      )}
    </div>
  );
};

export default BottomSheet;