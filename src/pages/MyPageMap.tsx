import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import NaverMap from '../components/User/map/NaverMap.tsx';
import BottomSheet from '../components/Map/BottomSheet.tsx';
import Pagination from '../components/Map/Pagination.tsx';
import PlaceItem from '../components/Map/interface/PlaceItem.tsx';
import InfoHeader from '../components/Map/interface/InfoHeader.tsx';
import PlaceDetail from '../components/Map/interface/PlaceDetail.tsx';

import { MarkerType } from '../types/map/type.ts';
import { PlaceItemType } from '../types/place/type.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { clearSelectedDetailedPlace, setSelectedPlaceId } from '../store/slices/searchSlice.ts';

const MyMapPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  const pageSize = 10;
  const selectedDetailedPlace = useSelector((state: RootState) => state.search.selectedDetailedPlace);

  const { places, focusReview: initialFocusReview }: { places: PlaceItemType[], focusReview?: boolean } = location.state || { places: [] };
  const [focusReview, setFocusReview] = useState(initialFocusReview);
  const prevPlaceRef = useRef(selectedDetailedPlace);
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstRender = useRef(true);

  const navigate = useNavigate();
  const userName = useSelector((state: RootState) => state.user.name);
  useEffect(() => {
    if (!userName) {
      navigate('/');
    }
  }, [userName]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(clearSelectedDetailedPlace());
  };

  useEffect(() => {
    dispatch(setSelectedPlaceId(null));
  }, []);

  useEffect(() => {
    if (selectedDetailedPlace) {
      const placeIndex = places.findIndex(place =>
        place.placeName === selectedDetailedPlace.placeName &&
        place.roadAddressName === selectedDetailedPlace.roadAddressName
      );
      if (placeIndex !== -1) {
        const targetPage = Math.floor(placeIndex / pageSize) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }

      if (isFirstRender.current && initialFocusReview) {
        isFirstRender.current = false;
      } else if (prevPlaceRef.current &&
        (prevPlaceRef.current.placeName !== selectedDetailedPlace.placeName ||
          prevPlaceRef.current.roadAddressName !== selectedDetailedPlace.roadAddressName)) {
        setFocusReview(false);
      }
      prevPlaceRef.current = selectedDetailedPlace;
    }
  }, [selectedDetailedPlace, places, currentPage, initialFocusReview]);

  const currentResults = useMemo(() => {
    return places.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [places, currentPage]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const markers: MarkerType[] = places.map((place) => ({
    id: place.id,
    lat: parseFloat(String(place.y || place.lat || '0')),
    lng: parseFloat(String(place.x || place.lng || '0')),
    title: place.placeName,
    address: place.addressName,
    roadAddress: place.roadAddressName,
    roadAddressEN: place.roadAddressNameEN,
    phone: place.phone,
    category: place.categoryName,
    categoryEN: place.categoryNameEN,
    categoryGroupCode: place.categoryGroupCode,
    placeUrl: place.placeUrl,
  }));


  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
    if (!focusReview) {
      dispatch(clearSelectedDetailedPlace());
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100dvh-96px)] h-[calc(100dvh-128px)] bg-[#DCE7EB]">

      {/* 리스트 영역 (모바일 제외) */}
      <div className="hidden md:block w-full md:w-[360px] lg:w-[420px] bg-white p-4 overflow-auto shadow-lg relative">
        <InfoHeader />
        <ul ref={listRef} className="space-y-4 overflow-auto h-[calc(100%-140px)] pr-3 py-4">
          {currentResults.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              🔍 No results found.<br />
              Try another category!
            </div>
          ) : (
            currentResults.map((place, index) => (
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
                lat={place.y || place.lat}
                lng={place.x || place.lng}
                index={index}
              />
            ))
          )}
        </ul>

        {/* 페이징 컴포넌트 수정 */}
        <Pagination
          currentPage={currentPage}
          totalCount={places.length}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 relative">
        <NaverMap markers={markers} />
        <AnimatePresence>
          {selectedDetailedPlace && (
            <PlaceDetail
              key="place-detail"
              focusReviewForm={focusReview}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 모바일 바텀시트 수정 */}
      <BottomSheet
        results={currentResults}
        currentPage={currentPage}
        totalCount={places.length}
        onPageChange={handlePageChange}
        isFetching={false}
      />
    </div>
  );
};

export default MyMapPage;
