import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSearchResults, setCurrentPage } from '../store/slices/searchSlice';
import KakaoMap from '../components/Map/KakaoMap.tsx';
import BottomSheet from "../components/Map/BottomSheet.tsx";
import { useKakaoPlaces } from '../hooks/findPlacesWithKeyword';
import Pagination from '../components/Map/Pagination';
import {motion} from "framer-motion";


const ResultPage = () => {
  const dispatch = useDispatch();
  const { keyword, currentPage, resultsByPage, meta, categories } = useSelector((state: RootState) => state.search);
  const pageSize = 10;
  let categoryGroupCode: string | undefined = undefined;
  if (categories.food && !categories.sights) {
    categoryGroupCode = 'FD6'; // 맛집
  } else if (!categories.food && categories.sights) {
    categoryGroupCode = 'AT4'; // 볼거리
  }
  const { data, refetch } = useKakaoPlaces(
    {
      query: keyword,
      page: currentPage,
      size: pageSize,
      category_group_code: categoryGroupCode
    },
    false
  );

  useEffect(() => {
    if (!resultsByPage[currentPage]) {
      refetch().then(({ data }) => {
        if (data) {
          dispatch(setSearchResults({ page: currentPage, results: data }));
        }
      });
    }
  }, [currentPage]);

  const currentResults = resultsByPage[currentPage] || [];

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100vh-96px)] h-[calc(100vh-128px)] bg-[#DCE7EB]">
      {/* 모바일: 리스트는 바텀시트로 */}
      <div className="hidden md:block w-full md:w-[400px] bg-white p-4 overflow-auto shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">추천 장소</h2>
        <ul className="space-y-4 overflow-auto h-[calc(100%-100px)]">
          {currentResults.map((place, index) => (
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
        <KakaoMap markers={[]} />
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