import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import Pagination from './Pagination';

interface BottomSheetProps {
  results: google.maps.places.PlaceResult[];
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
              className="space-y-3 max-h-[40vh] mb-16 overflow-auto pr-2">
            {results.length === 0 ? (
              <li className="text-center text-gray-500">로딩 중...</li>
            ) : (
              results.map((place, index) => (
                <motion.li
                  key={place.place_id}
                  className="bg-[#E9F1F4] p-3 rounded-xl relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-bold text-base mb-1 pr-7">{place.name}</h3>
                  <p className="text-sm">{place.formatted_address}</p>
                  {place.icon && (
                    <img
                      src={place.icon}
                      alt="category icon"
                      className="w-4 ml-3 flex-shrink-0 mt-1 absolute top-1 right-3"
                    />
                  )}
                </motion.li>
              ))
            )}
          </ul>

          {results.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalCount={60}
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