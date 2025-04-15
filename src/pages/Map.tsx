import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { RootState } from '../store';
import { setSearchResults, setCurrentPage, setSearchParams } from '../store/slices/searchSlice';
import NaverMap from '../components/Map/NaverMap.tsx';
import BottomSheet from "../components/Map/BottomSheet.tsx";
import { useKakaoPlaces } from '../hooks/findPlacesWithKeyword';
import Pagination from '../components/Map/Pagination';
import PlaceItem from "../components/Map/interface/PlaceItem.tsx";
import { MarkerType } from "../types/map/type.ts";
import { PlaceItemType } from "../types/place/type.ts";
import { toCamelCase } from "../components/Map/utils/placeResponseKeyToCamelCase.ts";
import InfoHeader from "../components/Map/interface/InfoHeader.tsx";
import queryString from 'query-string';

const ResultPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  const pageSize = 10;
  // 1. Redux 상태
  const { keyword, currentPage, resultsByPage,meta, categories } = useSelector(
    (state: RootState) => state.search
  );
  const { origin, destination } = useSelector((state: RootState) => state.search.selectedPlacePair);
  const selectedPlaceId = useSelector((state: RootState) => state.search.selectedPlaceId);
  useEffect(() => {
    if (selectedPlaceId) {
      const targetEl = document.getElementById(`place-item-${selectedPlaceId}`);
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [selectedPlaceId]);

  // 2. 쿼리 파싱 및 조건 설정
  const parsed = queryString.parse(location.search);
  const isCoordSearch = parsed.type === 'coord' && parsed.x && parsed.y;
  const categoryGroupCode =
    categories.food && !categories.sights
      ? 'FD6'
      : !categories.food && categories.sights
        ? 'AT4'
        : undefined;

  // 3. API 요청 파라미터 준비
  const searchParams = isCoordSearch
    ? {
      x: parsed.x as string,
      y: parsed.y as string,
      radius: 1500,
      page: currentPage,
      size: pageSize,
      category_group_code: categoryGroupCode,
      query:
        categories.food && !categories.sights
          ? '주변 맛집'
          : !categories.food && categories.sights
            ? '주변 볼거리'
            : '주변 장소',
    }
    : {
      query: keyword,
      page: currentPage,
      size: pageSize,
      category_group_code: categoryGroupCode,
    };

  // 4. API 요청 훅
  const { data, refetch } = useKakaoPlaces(searchParams, true);

  // 5. location.search 바뀔 때 Redux 상태 초기화
  useEffect(() => {
    const { city, region, food, sights, type } = parsed;
    const categories = {
      food: food === 'true',
      sights: sights === 'true',
    };

    if(type === 'keyword' && city && region)
    {
      dispatch(
        setSearchParams({
          city: String(city ?? ''),
          region: String(region ?? ''),
          categories,
        })
      );
    }
    if(type === 'coord'){
      dispatch(
        setSearchParams({
          city: String(city ?? ''),
          region: String(region ?? ''),
          categories,
        })
      );
    }
    dispatch(setCurrentPage(1)); // 항상 1페이지부터 시작

    // 바로 API 요청
    refetch().then(({ data }) => {
      if (data) {
        const normalized = data.map(toCamelCase);
        dispatch(setSearchResults({ page: 1, results: normalized }));
      }
    });
  }, [location.search]);

  // 6. data가 들어오고 1페이지면 저장 (보조적 처리)
  useEffect(() => {
    if (data && currentPage === 1 && !resultsByPage[1]) {
      const normalized = data.map(toCamelCase);
      dispatch(setSearchResults({ page: 1, results: normalized }));
    }
  }, [data, currentPage, dispatch, resultsByPage]);

  // 7. 페이지 변경 시 API 요청
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

    // 8. 리스트 스크롤 상단 이동
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // 9. 데이터 메모이제이션
  function normalizePlaceItem(place: PlaceItemType): PlaceItemType {
    return {
      ...place,
      x: place.lng?.toString() ?? '',
      y: place.lat?.toString() ?? '',
    };
  }

  const currentResults: PlaceItemType[] = useMemo(() => {
    const base = resultsByPage[currentPage] ?? [];
    const ids = new Set(base.map((p) => p.id));
    const additions: PlaceItemType[] = [];

    if (origin && !ids.has(origin.id)) additions.push(normalizePlaceItem(origin));
    if (destination && !ids.has(destination.id)) additions.push(normalizePlaceItem(destination));

    return [...base, ...additions];
  }, [resultsByPage, currentPage, origin, destination]);

  // 10. 마커 데이터 변환
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

  // 11. 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100dvh-96px)] h-[calc(100dvh-128px)] bg-[#DCE7EB]">
      {/* 모바일: 리스트는 바텀시트로 */}
      <div className="hidden md:block w-full md:w-[420px] bg-white p-4 overflow-auto shadow-lg relative">
        <InfoHeader/>
        <ul ref={listRef}
            className="space-y-4 overflow-auto h-[calc(100%-190px)] pr-3 py-4">
          {currentResults.map((place, index) => (
            <PlaceItem
              key={index}
              id={place.id}
              placeName={place.placeName}
              roadAddressName={place.roadAddressName}
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
      <BottomSheet  results={currentResults}
                    currentPage={currentPage}
                    totalCount={meta?.pageable_count || 0}
                    onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ResultPage;
