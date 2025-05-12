import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../store";
import { clearSelectedDetailedPlace } from "../../../store/slices/searchSlice.ts";
import Icon from '@mdi/react';
import { mdiClose, mdiClipboardTextOutline,
  mdiCommentTextMultipleOutline,
  mdiMapMarker, mdiLink, mdiPencil,
  mdiCheck,
  mdiCloseCircleOutline, } from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
import { getPlaceInfo, submitChangeRequest } from '../utils/getPlaceInfoClient';
import FetchingUI from './FetchingUI.tsx';
import { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector.tsx';
import ToastMessage from '../../../interface/ToastMessage';

const PlaceDetail = () => {
  const dispatch = useDispatch();
  const place = useSelector((state: RootState) => state.search.selectedDetailedPlace);
  const isMobile = window.innerWidth < 768;
  const [selectedLanguage, setSelectedLanguage] = useState("영어");
  const [editMode, setEditMode] = useState(false);
  const [editedMenu, setEditedMenu] = useState<{ name: string; price: string }[]>([]);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [showSuccess, setShowSuccess] = useState(false);

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
    setSelectedLanguage("영어");
  }, [place]);
  useEffect(() => {
    if (detailedInfo?.menuOrTicketInfo) {
      const deepCopied = detailedInfo.menuOrTicketInfo.map((item) => ({
        name: item.name,
        price: item.price,
      }));
      setEditedMenu(deepCopied);
    }
  }, [detailedInfo, editMode]);

  const resetEditMode = () => {
    setEditMode(false);
    if (detailedInfo?.menuOrTicketInfo) {
      const deepCopied = detailedInfo.menuOrTicketInfo.map((item) => ({
        name: item.name,
        price: item.price,
      }));
      setEditedMenu(deepCopied);
    }
  };

  const handleSubmitEdit = async () => {
    const filteredMenu = editedMenu.filter(
      (item) => item.name.trim() !== '' && item.price.trim() !== ''
    );
    
    if (filteredMenu.length === 0 || !detailedInfo?.id) {
      alert("Please provide valid menu items.");
      return;
    }
    // 원본 메뉴 데이터와 비교
    const originalMenu = detailedInfo.menuOrTicketInfo || [];
    const hasChanges = JSON.stringify(originalMenu) !== JSON.stringify(filteredMenu);

    if (!hasChanges) {
      resetEditMode();
      return;
    }
  
    try {
      const result = await submitChangeRequest(detailedInfo.id, filteredMenu, accessToken!);
      console.log('✅ 서버 응답:', result);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      resetEditMode();
    } catch (err) {
      console.error(err);
      alert("Failed to submit change request.");
    }
  };

  return (
    <>
      <ToastMessage show={showSuccess} message="Change request submitted successfully!" />
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

        <div className="flex flex-col overflow-auto h-full pr-2">
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
            For more information (Korean)
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
            <div className="mt-4 pt-4 text-sm border-t border-[#B5CC88] mb-8">
                        {/* 메뉴 정보 */}
              <div className="flex justify-end gap-2 mb-2">
                {!editMode && (
                  <button
                    onClick={() => {
                      if(!accessToken) {
                        document.getElementById('login-button')?.click();
                        return;
                      }
                      setEditMode(true);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition inline-flex items-center gap-1"
                  >
                    <Icon path={mdiPencil} size={0.8} /> Edit
                  </button>
                )}
                {editMode && (
                  <>
                    <button
                      onClick={handleSubmitEdit}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition inline-flex items-center gap-1"
                    >
                      <Icon path={mdiCheck} size={0.8} /> Submit
                    </button>
                    <button
                      onClick={resetEditMode}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition inline-flex items-center gap-1"
                    >
                      <Icon path={mdiCloseCircleOutline} size={0.8} /> Cancel
                    </button>
                  </>
                )}
            </div>
            {Array.isArray(detailedInfo.menuOrTicketInfo) && (
              <div className="rounded-md mb-5">
                <h3 className="font-bold text-[#9B59B6] text-base border-b border-[#F7CAC9] pb-1 mb-2 flex items-center gap-2">
                  <Icon path={mdiClipboardTextOutline} size={0.9} color="#9B59B6" />
                  Menu / Ticket
                </h3>

                {editMode ? (
                  <>
                    <ul className="space-y-2 mb-2">
                      {editedMenu.map((item, idx) => (
                        <li key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...editedMenu];
                              updated[idx].name = e.target.value;
                              setEditedMenu(updated);
                            }}
                            placeholder="Name"
                            className="border px-2 py-1 rounded w-1/2 text-sm"
                          />
                          <input
                            type="text"
                            value={item.price}
                            onChange={(e) => {
                              const updated = [...editedMenu];
                              updated[idx].price = e.target.value;
                              setEditedMenu(updated);
                            }}
                            placeholder="Price"
                            className="border px-2 py-1 rounded w-1/2 text-sm"
                          />
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() =>
                        setEditedMenu([...editedMenu, { name: '', price: '' }])
                      }
                      className="text-sm text-green-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Icon path={mdiCheck} size={0.8} /> 메뉴 항목 추가
                    </button>
                  </>
                ) : (
                  <ul className="space-y-1 list-disc list-inside text-[#555555]">
                    {detailedInfo.menuOrTicketInfo.map((item) => (
                      <li key={item.name}>
                        <span className="font-medium text-[#1B5E20]">{item.name}</span> — {item.price}
                      </li>
                    ))}
                  </ul>
                )}
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

              {/* 참고 URL */}
              {Array.isArray(detailedInfo.referenceUrls) && detailedInfo.referenceUrls.length > 0 && (
                <div className="rounded-md">
                  <h3 className="font-bold text-[#2E86C1] text-base border-b border-[#AED6F1] pb-1 mb-2 flex items-center gap-2">
                    <Icon path={mdiLink} size={0.9} color="#2E86C1" />
                    Reference Links
                  </h3>
                  <ul className="space-y-2 overflow-y-auto pr-1 text-[#2E86C1] text-sm leading-snug">
                    {detailedInfo.referenceUrls.map((url: string, idx: number) => (
                      <li
                        key={idx}
                        className="border border-[#AED6F1] p-2 rounded-md bg-[#FAFAFA]"
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline break-all"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PlaceDetail;
