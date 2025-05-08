// src/pages/MyMap.tsx
import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import NaverMap from '../components/User/map/NaverMap.tsx';
import BottomSheet from '../components/Map/BottomSheet.tsx';
import Pagination from '../components/Map/Pagination.tsx';
import PlaceItem from '../components/Map/interface/PlaceItem.tsx';
import InfoHeader from '../components/Map/interface/InfoHeader.tsx';
import PlaceDetail from '../components/Map/interface/PlaceDetail.tsx';

import { MarkerType } from '../types/map/type.ts';
import { PlaceItemType } from '../types/place/type.ts';

const MyMapPage = () => {
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  const pageSize = 10;

  const { places }: { places: PlaceItemType[] } = location.state || { places: [] };
  // 페이징 상태: URL, Redux 없음
  const totalPageCount = Math.ceil(places.length / pageSize);
  const currentPage = 1; // 단순화 버전 (페이지 변경 없음)

  // 리스트 페이징 결과
  const currentResults = useMemo(() => {
    return places.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [places, currentPage]);

  // 마커 데이터 변환
  const markers: MarkerType[] = places.map((place) => ({
    id: place.id,
    lat: parseFloat(place.y ?? '0'),
    lng: parseFloat(place.x ?? '0'),
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

  // 리스트 스크롤 초기화
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, []);

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100dvh-96px)] h-[calc(100dvh-128px)] bg-[#DCE7EB]">

      {/* 리스트 영역 (모바일 제외) */}
      <div className="hidden md:block w-full md:w-[360px] lg:w-[420px] bg-white p-4 overflow-auto shadow-lg relative">
        <InfoHeader />
        <ul ref={listRef} className="space-y-4 overflow-auto h-[calc(100%-190px)] pr-3 py-4">
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
                lat={place.y}
                lng={place.x}
                index={index}
              />
            ))
          )}
        </ul>

        {/* 페이징은 표시만, 현재 페이지 고정 */}
        <Pagination
          currentPage={1}
          totalCount={places.length}
          itemsPerPage={pageSize}
          onPageChange={() => {}}
        />
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 relative">
        <NaverMap markers={markers} />
        <AnimatePresence>
          {/* 선택 상세 정보 UI는 상태 연동 생략 */}
          <PlaceDetail key="place-detail" />
        </AnimatePresence>
      </div>

      {/* 모바일 바텀시트 */}
      <BottomSheet
        results={currentResults}
        currentPage={1}
        totalCount={places.length}
        onPageChange={() => {}}
        isFetching={false}
      />
    </div>
  );
};

export default MyMapPage;
