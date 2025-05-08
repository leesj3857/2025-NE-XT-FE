import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../store";
import { clearSelectedDetailedPlace } from "../../../store/slices/searchSlice.ts";
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
import { getPlaceInfo } from '../utils/getPlaceInfoClient';

const PlaceDetail = () => {
  const dispatch = useDispatch();
  const place = useSelector((state: RootState) => state.search.selectedDetailedPlace);
  const isMobile = window.innerWidth < 768;

  const {
    data: detailedInfo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['placeInfo', place?.placeName, place?.roadAddressName],
    queryFn: () => {
      if (!place) throw new Error('No place selected');
      return getPlaceInfo(place.placeName!, place.roadAddressName!, 'EN');
    },
    enabled: !!place, // place가 존재할 때만 요청 실행
    retry: false,
  });


  return (
    <motion.div
      initial={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
      animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
      exit={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: 100 }}
      className="p-4 overflow-auto bg-white shadow-xl rounded-xl
      max-md:fixed max-md:top-1/2 max-md:w-5/6 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:pt-12 max-md:h-[70%]
      md:absolute md:top-1/2 md:-translate-y-1/2 md:left-2 md:w-[380px] md:h-[90%]
      "
    >
      {/* X 버튼 (mdi) */}
      <button
        onClick={() => dispatch(clearSelectedDetailedPlace())}
        className="absolute top-4 right-4 text-gray-400 hover:text-black"
        aria-label="Close detail"
      >
        <Icon path={mdiClose} size={1} />
      </button>

      {/* 상세 정보 내용 */}
      <h2 className="text-xl font-semibold">{place?.placeName}</h2>
      <p className="text-sm text-gray-600">{place?.roadAddressNameEN}</p>
      <p className="text-sm text-gray-600">{place?.phone}</p>
      <p className="text-sm text-gray-500 mt-2">{place?.categoryNameEN}</p>
      <a
        href={place?.placeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline text-sm mt-4 inline-block"
      >
        상세 정보 보기
      </a>
      {isLoading && <p className="text-sm text-gray-400 mt-4">🔄 Loading place details...</p>}
      {isError && <p className="text-sm text-red-500 mt-4">❌ {error.message}</p>}

      {detailedInfo && (
        <div className="mt-4 pt-4 text-sm space-y-5 border-t border-gray-200">
          {/* 기본 정보 */}
          <div className="space-y-1">
            {detailedInfo.description && (
              <p><span className="font-semibold text-gray-700">Description:</span> {detailedInfo.description}</p>
            )}
            {detailedInfo.price && (
              <p><span className="font-semibold text-gray-700">Price:</span> {detailedInfo.price}</p>
            )}
          </div>

          {/* 메뉴 정보 */}
          {detailedInfo.menuOrTicketInfo && detailedInfo.menuOrTicketInfo.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-800 text-base border-b border-gray-300 pb-1 mb-2">📋 Menu / Ticket</h3>
              <ul className="space-y-1 list-disc list-inside text-gray-700">
                {detailedInfo.menuOrTicketInfo.map((item) => (
                  <li key={item.name}>
                    <span className="font-medium">{item.name}</span> — {item.price}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 리뷰 */}
          {detailedInfo.translatedReviews?.length && detailedInfo.translatedReviews.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-800 text-base border-b border-gray-300 pb-1 mb-2">💬 Reviews</h3>
              <ul className="space-y-2 overflow-y-auto pr-1 text-gray-700 text-sm leading-snug">
                {detailedInfo.translatedReviews.map((review: string, idx: number) => (
                  <li key={idx} className="border border-gray-200 p-2 rounded-md bg-gray-50">
                    {review}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PlaceDetail;
