import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import BottomSheet from "../components/Map/BottomSheet.tsx";
import Pagination from '../components/Map/Pagination';
import {motion} from "framer-motion";
import GoogleMapWrapper from '../components/Map/GoogleMap';

const ResultPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { results, keyword } = useSelector((state: RootState) => state.search);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResults = results.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col md:flex-row max-md:h-[calc(100vh-96px)] h-[calc(100vh-128px)] bg-[#DCE7EB]">
      {/* 모바일: 리스트는 바텀시트로 */}
      <div className="hidden md:block w-full md:w-[400px] bg-white p-4 overflow-auto shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">추천 장소</h2>
        <ul className="list-none space-y-4 overflow-auto h-[calc(100%-100px)]">
          {currentResults.length === 0 ? (
            <li className="text-center text-gray-500 mt-10">로딩 중...</li>
          ) : (
            currentResults.map((place: google.maps.places.PlaceResult, index: number) => (
              <motion.li
                key={place.place_id}
                className="bg-[#E9F1F4] p-3 rounded-xl relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-bold text-base mb-1 pr-8">{place.name}</h3>
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

        {currentResults.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalCount={60}
            itemsPerPage={10}
            onPageChange={handlePageChange}
          />
        )}


      </div>

      {/* 지도 영역 */}
      <div className="flex-1">
        {/*<KakaoMap*/}
        {/*  markers={currentResults.map((place) => ({*/}
        {/*    lat: parseFloat(place.y),*/}
        {/*    lng: parseFloat(place.x),*/}
        {/*    title: place.place_name,*/}
        {/*  }))}*/}
        {/*/>*/}
        <GoogleMapWrapper
          keyword={keyword}
          markers={currentResults.map((place) => ({
            lat: place.geometry?.location?.lat() ?? 0,
            lng: place.geometry?.location?.lng() ?? 0,
            title: place.name,
            category_name: place.types?.[0] || '',
            road_address_name: place.formatted_address || '',
            photo: place.photos?.[0],
            place_id: place.place_id,
          }))}
          // markers={currentResults.map((place) => ({
          //   lat: parseFloat(place.y),
          //   lng: parseFloat(place.x),
          //   title: place.place_name,
          //   category_name: place.category_name,
          //   road_address_name: place.road_address_name,
          // }))}
        />
      </div>


      <BottomSheet  results={currentResults}
                    currentPage={currentPage}
                    totalCount={60}
                    onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ResultPage;