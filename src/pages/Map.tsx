import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import queryString from 'query-string';

import { RootState } from '../store';
import {
  setSearchParams,
  setSearchResults,
  setCurrentPage,
  clearSelectedDetailedPlace,
} from '../store/slices/searchSlice';

import { useKakaoPlaces } from '../utils/findPlacesWithKeyword.ts';
import { toCamelCase } from '../components/Map/utils/placeResponseKeyToCamelCase.ts';

import NaverMap from '../components/Map/NaverMap.tsx';
import BottomSheet from '../components/Map/BottomSheet.tsx';
import Pagination from '../components/Map/Pagination';
import PlaceItem from '../components/Map/interface/PlaceItem.tsx';
import InfoHeader from '../components/Map/interface/InfoHeader.tsx';
import FetchingUI from '../components/Map/interface/FetchingUI.tsx';
import PlaceDetail from '../components/Map/interface/PlaceDetail.tsx';

import { MarkerType } from '../types/map/type.ts';
import { PlaceItemType } from '../types/place/type.ts';

const ResultPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const listRef = useRef<HTMLUListElement>(null);
  const pageSize = 10;

  const [searchKey, setSearchKey] = useState('');

  const { keyword, currentPage, resultsByPage, meta, categories } = useSelector(
    (state: RootState) => state.search
  );
  const { origin, destination } = useSelector((state: RootState) => state.search.selectedPlacePair);
  const selectedPlaceId = useSelector((state: RootState) => state.search.selectedPlaceId);
  const selectedDetailedPlace = useSelector((state: RootState) => state.search.selectedDetailedPlace);


  const parsed = useMemo(() => queryString.parse(location.search), [location.search]);


  useEffect(() => {
    dispatch(clearSelectedDetailedPlace());
    setSearchKey(location.search);
  }, [location.search]);

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

  const { data, refetch, isFetching } = useKakaoPlaces(searchParams!, searchKey === location.search);

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

    dispatch(setCurrentPage(1));
  }, [location.search]);

  useEffect(() => {
    if (data && currentPage === 1 && !resultsByPage[1]) {
      const normalized = data.map(toCamelCase);
      dispatch(setSearchResults({ page: 1, results: normalized }));
    }
  }, [data, currentPage, dispatch, resultsByPage]);

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

  useEffect(() => {
    if (selectedPlaceId) {
      const el = document.getElementById(`place-item-${selectedPlaceId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedPlaceId]);

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

  const markers: MarkerType[] = currentResults.map((place) => ({
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

  const handlePageChange = (page: number) => dispatch(setCurrentPage(page));

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100dvh-96px)] h-[calc(100dvh-128px)] bg-[#DCE7EB]">

      {/* 리스트 영역 (모바일 제외) */}
      <div className="hidden md:block w-full md:w-[360px] lg:w-[420px] bg-white p-4 overflow-auto shadow-lg relative">
        <InfoHeader />
        <ul ref={listRef} className="space-y-4 overflow-auto h-[calc(100%-140px)] pr-3 py-4">
          {isFetching ? (
            <div className="flex justify-center items-center h-full">
              <FetchingUI />
            </div>
          ) : currentResults.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              🔍 No results found.<br />
              Try searching with a different keyword or location!
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
      <div className="flex-1 relative">
        <NaverMap markers={markers} />
        <AnimatePresence>
          {selectedDetailedPlace && <PlaceDetail key="place-detail" />}
        </AnimatePresence>
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
