import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { RootState } from '../store';
import {
  setSearchParams,
  setSearchResults,
  setCurrentPage,
} from '../store/slices/searchSlice';

import { useKakaoPlaces } from '../hooks/findPlacesWithKeyword';
import { toCamelCase } from '../components/Map/utils/placeResponseKeyToCamelCase.ts';

import NaverMap from '../components/Map/NaverMap.tsx';
import BottomSheet from '../components/Map/BottomSheet.tsx';
import Pagination from '../components/Map/Pagination';
import PlaceItem from '../components/Map/interface/PlaceItem.tsx';
import InfoHeader from '../components/Map/interface/InfoHeader.tsx';
import FetchingUI from '../components/Map/interface/FetchingUI.tsx';

import { MarkerType } from '../types/map/type.ts';
import { PlaceItemType } from '../types/place/type.ts';

const ResultPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  const pageSize = 10;

  const [searchKey, setSearchKey] = useState('');

  // Redux 상태
  const { keyword, currentPage, resultsByPage, meta, categories } = useSelector(
    (state: RootState) => state.search
  );
  const { origin, destination } = useSelector((state: RootState) => state.search.selectedPlacePair);
  const selectedPlaceId = useSelector((state: RootState) => state.search.selectedPlaceId);

  // 쿼리 파싱
  const parsed = useMemo(() => queryString.parse(location.search), [location.search]);

  // searchKey 갱신 (한 번만 실행 제어용)
  useEffect(() => {
    setSearchKey(location.search);
  }, [location.search]);

  // searchParams 계산
  const searchParams = useMemo(() => {
    const isCoordSearch = parsed.type === 'coord' && parsed.x && parsed.y;
    const categoryGroupCode =
      categories.food && !categories.sights ? 'FD6' :
        !categories.food && categories.sights ? 'AT4' : undefined;

    if (isCoordSearch) {
      return {
        x: parsed.x as string,
        y: parsed.y as string,
        radius: 1500,
        page: currentPage,
        size: pageSize,
        category_group_code: categoryGroupCode,
        query:
          categories.food ? '주변 맛집' :
            categories.sights ? '주변 볼거리' : '주변 장소',
      };
    }

    if (parsed.type === 'keyword') {
      return {
        query: keyword,
        page: currentPage,
        size: pageSize,
        category_group_code: categoryGroupCode,
      };
    }

    return null;
  }, [parsed, keyword, categories, currentPage]);

  // 장소 데이터 요청
  const { data, refetch, isFetching } = useKakaoPlaces(searchParams!, searchKey === location.search);

  // 1. 검색 조건 상태 Redux에 저장
  useEffect(() => {
    const { city, region, food, sights, type } = parsed;
    const categories = {
      food: food === 'true',
      sights: sights === 'true',
    };

    if (type === 'keyword' || type === 'coord') {
      dispatch(setSearchParams({
        city: String(city ?? ''),
        region: String(region ?? ''),
        categories,
      }));
    }

    dispatch(setCurrentPage(1)); // 검색 조건이 바뀌면 무조건 1페이지부터
  }, [location.search]);

  // 2. 1페이지 결과 저장
  useEffect(() => {
    if (data && currentPage === 1 && !resultsByPage[1]) {
      const normalized = data.map(toCamelCase);
      dispatch(setSearchResults({ page: 1, results: normalized }));
    }
  }, [data, currentPage, dispatch, resultsByPage]);

  // 3. 페이지 변경 시 refetch
  useEffect(() => {
    if (currentPage === 1) return;

    if (!resultsByPage[currentPage]) {
      refetch().then(({ data }) => {
        if (data) {
          const normalized = data.map(toCamelCase);
          dispatch(setSearchResults({ page: currentPage, results: normalized }));
        }
      });
    }

    if (listRef.current) listRef.current.scrollTop = 0;
  }, [currentPage]);

  // 4. 선택된 아이템 스크롤 이동
  useEffect(() => {
    if (selectedPlaceId) {
      const el = document.getElementById(`place-item-${selectedPlaceId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPlaceId]);

  // 5. 현재 페이지 결과에 origin/destination 포함
  const currentResults: PlaceItemType[] = useMemo(() => {
    const base = resultsByPage[currentPage] ?? [];
    const ids = new Set(base.map((p) => p.id));
    const additions: PlaceItemType[] = [];

    const normalize = (place: PlaceItemType): PlaceItemType => ({
      ...place,
      x: place.lng?.toString() ?? '',
      y: place.lat?.toString() ?? '',
    });

    if (origin && !ids.has(origin.id)) additions.push(normalize(origin));
    if (destination && !ids.has(destination.id)) additions.push(normalize(destination));

    return [...base, ...additions];
  }, [resultsByPage, currentPage, origin, destination]);

  // 6. 마커 변환
  const markers: MarkerType[] = currentResults.map((place) => ({
    id: place.id,
    lat: parseFloat(place.y ?? '0'),
    lng: parseFloat(place.x ?? '0'),
    title: place.placeName,
    address: place.addressName,
    roadAddress: place.roadAddressName,
    phone: place.phone,
    category: place.categoryName,
    categoryGroupCode: place.categoryGroupCode,
    placeUrl: place.placeUrl,
  }));

  const handlePageChange = (page: number) => dispatch(setCurrentPage(page));

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100dvh-96px)] h-[calc(100dvh-128px)] bg-[#DCE7EB]">

      {/* 리스트 영역 (모바일 제외) */}
      <div className="hidden md:block w-full md:w-[420px] bg-white p-4 overflow-auto shadow-lg relative">
        <InfoHeader />
        <ul ref={listRef} className="space-y-4 overflow-auto h-[calc(100%-190px)] pr-3 py-4">
          {isFetching
            ? Array.from({ length: 5 }).map((_, i) => <FetchingUI key={i} />)
            : currentResults.map((place, index) => (
              <PlaceItem
                key={index}
                id={place.id}
                placeName={place.placeName}
                roadAddressName={place.roadAddressName}
                roadAddressNameEN={place.roadAddressNameEN}
                phone={place.phone}
                categoryName={place.categoryName}
                placeUrl={place.placeUrl}
                categoryGroupCode={place.categoryGroupCode}
                lat={place.y}
                lng={place.x}
                index={index}
              />
            ))}
        </ul>

        {meta && (
          <Pagination
            currentPage={currentPage}
            totalCount={meta.pageable_count}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* 지도 영역 */}
      <div className="flex-1">
        <NaverMap markers={markers} />
      </div>

      {/* 모바일 전용 바텀시트 */}
      <BottomSheet
        results={currentResults}
        currentPage={currentPage}
        totalCount={meta?.pageable_count || 0}
        onPageChange={handlePageChange}
        isFetching={isFetching}
      />
    </div>
  );
};

export default ResultPage;
