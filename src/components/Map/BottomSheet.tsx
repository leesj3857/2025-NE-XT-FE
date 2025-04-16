import { useState, useEffect, useRef } from 'react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Icon from '@mdi/react';
import Pagination from './Pagination';
import PlaceItem from "./interface/PlaceItem.tsx";
import { PlaceItemType } from '../../types/place/type';
import InfoHeader from "./interface/InfoHeader.tsx";
import FetchingUI from "./interface/FetchingUI.tsx";

interface BottomSheetProps {
  results: PlaceItemType[];
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isFetching: boolean;
}

const BottomSheet = ({ results, currentPage, totalCount, onPageChange, isFetching }: BottomSheetProps) => {
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
          <InfoHeader/>
          <ul ref={listRef}
              className="space-y-3 max-h-[45dvh] mb-16 overflow-auto pr-4">
            {isFetching ? (
              Array.from({ length: 5 }).map((_, i) => <FetchingUI key={i} />)
            ) : results.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                🔍 No results found.<br />
                Try searching with a different keyword or location!
              </div>
            ) : (
              results.map((place, index) => (
                <PlaceItem
                  key={index}
                  id={place.id}
                  placeName={place.placeName}
                  roadAddressName={place.roadAddressName}
                  roadAddressNameEN={place.roadAddressNameEN}
                  phone={place.phone}
                  categoryName={place.categoryName}
                  categoryNameEN={place.categoryNameEN}
                  placeUrl={place.placeUrl}
                  categoryGroupCode={place.categoryGroupCode}
                  lat={place.y}
                  lng={place.x}
                  index={index}
                />
              ))
            )}
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