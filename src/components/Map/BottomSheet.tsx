import { useState, useEffect, useRef } from 'react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import Pagination from './Pagination';
import PlaceItem from "./interface/PlaceItem.tsx";
import { PlaceItemType } from '../../types/place/type';

interface BottomSheetProps {
  results: PlaceItemType[];
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
  useEffect(()=>{
    setIsOpen(true)
  },[results]);
  return (
    <div className={`md:hidden fixed bottom-0 left-0 w-full bg-white shadow-xl ${isOpen && 'rounded-t-xl'} z-50 px-4`}>
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
              className="space-y-3 max-h-[45dvh] mb-16 overflow-auto pr-4">
            {results.map((place, index) => (
              <PlaceItem
                key={place.id}
                id={place.id}
                placeName={place.placeName}
                roadAddressName={place.roadAddressName}
                phone={place.phone}
                categoryName={place.categoryName}
                placeUrl={place.placeUrl}
                categoryGroupCode={place.categoryGroupCode}
                index={index}
              />
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