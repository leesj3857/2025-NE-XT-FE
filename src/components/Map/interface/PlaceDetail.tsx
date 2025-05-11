import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../store";
import { clearSelectedDetailedPlace } from "../../../store/slices/searchSlice.ts";
import Icon from '@mdi/react';
import { mdiClose, mdiClipboardTextOutline,
  mdiCommentTextMultipleOutline,
  mdiMapMarker } from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
import { getPlaceInfo } from '../utils/getPlaceInfoClient';
import FetchingUI from './FetchingUI.tsx';
import { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector.tsx';
const PlaceDetail = () => {
  const dispatch = useDispatch();
  const place = useSelector((state: RootState) => state.search.selectedDetailedPlace);
  const isMobile = window.innerWidth < 768;
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const {
    data: detailedInfo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['placeInfo', place?.placeName, place?.roadAddressName, selectedLanguage],
    queryFn: () => {
      if (!place) throw new Error('No place selected');
      return getPlaceInfo(place.placeName!, place.roadAddressName!, selectedLanguage);
    },
    enabled: !!place, // place가 존재할 때만 요청 실행
    retry: false,
  });
  
  useEffect(() => {
    setSelectedLanguage("English");
  }, [place]);

  return (
    <motion.div
      initial={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
      animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
      exit={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: 100 }}
      className="p-4 rounded-xl shadow-xl bg-[#FAFAFA]
                max-md:fixed max-md:top-1/2 max-md:w-5/6 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 
                pt-14 max-md:h-[70%] md:absolute md:top-1/2 md:-translate-y-1/2 md:left-2 md:w-[400px] md:h-[90%]  "
    >
      {/* X 버튼 (mdi) */}
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      <button
        onClick={() => dispatch(clearSelectedDetailedPlace())}
        className="absolute top-4 right-4 text-gray-400 hover:text-black"
        aria-label="Close detail"
      >
        <Icon path={mdiClose} size={1} />
      </button>

      <div className="flex flex-col overflow-auto h-full">
        {/* 상세 정보 내용 */}
        <h2 className="text-xl font-bold text-[#34495E]">{place?.placeName}</h2>
        <p className="text-sm text-[#555555]">{place?.roadAddressNameEN}</p>
        <p className="text-sm text-[#555555]">{place?.phone}</p>
        <p className="text-sm text-[#8D6E63] mt-2">{place?.categoryNameEN}</p>
        <a
          href={place?.placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0096C7] hover:text-[#007BA3] underline text-sm mt-4 inline-flex items-center gap-1 transition-all"
        >
          <Icon path={mdiMapMarker} size={0.9} />
          View on Kakao (Korean)
        </a>
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <FetchingUI />
          </div>
        )}
        {isError && (
          <p className="text-sm text-red-500 mt-4">❌ {error.message}</p>
        )}

        {detailedInfo && (
          <div className="mt-4 pt-4 text-sm space-y-5 border-t border-[#B5CC88]">
            {/* 기본 정보 */}
            {(detailedInfo.description || detailedInfo.price) && (
              <div className="space-y-1 rounded-md">
              {detailedInfo.description && (
                <p>
                  <span className="font-semibold text-[#34495E]">Description:</span> {detailedInfo.description}
                </p>
              )}
              {detailedInfo.price && (
                <p>
                  <span className="font-semibold text-[#34495E]">Price:</span> {detailedInfo.price}
                </p>
              )}
            </div>
            )}
            {/* 메뉴 정보 */}
            {Array.isArray(detailedInfo.menuOrTicketInfo) && detailedInfo.menuOrTicketInfo.length > 0 && (
              <div className="rounded-md">
                <h3 className="font-bold text-[#9B59B6] text-base border-b border-[#F7CAC9] pb-1 mb-2 flex items-center gap-2">
                  <Icon path={mdiClipboardTextOutline} size={0.9} color="#9B59B6" />
                  Menu / Ticket
                </h3>
                <ul className="space-y-1 list-disc list-inside text-[#555555]">
                  {detailedInfo.menuOrTicketInfo.map((item) => (
                    <li key={item.name}>
                      <span className="font-medium text-[#1B5E20]">{item.name}</span> — {item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 리뷰 */}
            {Array.isArray(detailedInfo.translatedReviews) && detailedInfo.translatedReviews.length > 0 && (
              <div className="rounded-md">
                <h3 className="font-bold text-[#34495E] text-base border-b border-[#D2B48C] pb-1 mb-2 flex items-center gap-2">
                  <Icon path={mdiCommentTextMultipleOutline} size={0.9} color="#34495E" />
                  Reviews
                </h3>
                <ul className="space-y-2 overflow-y-auto pr-1 text-[#34495E] text-sm leading-snug">
                  {detailedInfo.translatedReviews.map((review: string, idx: number) => (
                    <li
                      key={idx}
                      className="border border-[#8D6E63] p-2 rounded-md bg-[#FAFAFA]"
                    >
                      {review}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlaceDetail;
