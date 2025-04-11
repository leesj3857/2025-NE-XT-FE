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
import queryString from 'query-string';

const ResultPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { keyword, currentPage, resultsByPage, meta, categories } = useSelector((state: RootState) => state.search);
  const listRef = useRef<HTMLUListElement>(null);
  const [readyToSearch, setReadyToSearch] = useState(false);
  const pageSize = 10;
  let categoryGroupCode: string | undefined = undefined;
  if (categories.food && !categories.sights) {
    categoryGroupCode = 'FD6'; // 맛집
  } else if (!categories.food && categories.sights) {
    categoryGroupCode = 'AT4'; // 볼거리
  }

  const toCamelCase = (place: any): PlaceItemType => ({
    id: place.id,
    placeName: place.place_name,
    addressName: place.address_name,
    roadAddressName: place.road_address_name,
    phone: place.phone,
    categoryName: place.category_name,
    placeUrl: place.place_url,
    categoryGroupCode: place.category_group_code,
    x: place.x,
    y: place.y,
  });
  console.log(keyword);
  const { data, refetch } = useKakaoPlaces(
    readyToSearch
      ? {
        query: keyword,
        page: currentPage,
        size: pageSize,
        category_group_code: categoryGroupCode,
      }
      : undefined, // 준비 안 됐으면 undefined
    readyToSearch // 조건이 맞을 때만 fetch하도록
  );


  const currentResults: PlaceItemType[] = resultsByPage[currentPage] ?? [];
  const markers: MarkerType[] = currentResults.map((place) => ({
    id: place.id,
    lat: parseFloat(place.y ?? '0'),
    lng: parseFloat(place.x ?? '0'),
    title: place.placeName,
    address: place.addressName,
    roadAddress: place.roadAddressName,
    phone: place.phone,
    category: place.categoryName,
    placeUrl: place.placeUrl,
  }));

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  useEffect(() => {
    const { city, region, food, sights } = queryString.parse(location.search);
    if (city && region) {
      const categories = {
        food: food === 'true',
        sights: sights === 'true',
      };

      dispatch(
        setSearchParams({
          city: String(city),
          region: String(region),
          categories,
        })
      );

      setReadyToSearch(true);
    }
  }, []);

  //키워드로 데이터 최초로 받아오는 훅. readyToSearch로 리렌더링 유발해서 저장된 키워드로 useKakaoPlaces 실행시키게
  useEffect(() => {
    if (readyToSearch) {
      refetch().then(({ data }) => {
        if (data) {
          const normalized = data.map(toCamelCase);
          dispatch(setSearchResults({ page: currentPage, results: normalized }));
        }
      });
    }
  }, [readyToSearch]);

  useEffect(() => {

    if (currentPage === 1) return; // ✅ 첫 페이지는 위에서 호출하므로 생략

    if (!resultsByPage[currentPage]) {
      refetch().then(({ data }) => {
        if (data) {
          console.log(data);
          const normalized = data.map(toCamelCase);
          dispatch(setSearchResults({ page: currentPage, results: normalized }));
        }
      });
    }
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100vh-96px)] h-[calc(100vh-128px)] bg-[#DCE7EB]">
      {/* 모바일: 리스트는 바텀시트로 */}
      <div className="hidden md:block w-full md:w-[400px] bg-white p-4 overflow-auto shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">추천 장소</h2>
        <ul ref={listRef}
            className="space-y-4 overflow-auto h-[calc(100%-100px)] pr-3 py-4">
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