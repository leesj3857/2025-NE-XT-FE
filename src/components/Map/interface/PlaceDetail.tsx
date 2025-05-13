import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../store";
import { clearSelectedDetailedPlace } from "../../../store/slices/searchSlice.ts";
import Icon from '@mdi/react';
import { mdiClose, mdiClipboardTextOutline,
  mdiCommentTextMultipleOutline,
  mdiMapMarker, mdiLink, mdiPencil,
  mdiCheck,
  mdiCloseCircleOutline,
  mdiPlus,
  mdiImagePlus,
  mdiImage,
  mdiDelete,
  mdiSend,
  mdiCancel,
  mdiMinusCircle
} from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
import { getPlaceInfo, submitChangeRequest } from '../utils/getPlaceInfoClient';
import FetchingUI from './FetchingUI.tsx';
import { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector.tsx';
import ToastMessage from '../../../interface/ToastMessage';
import ImagePopup from './ImagePopup';

// ===== Types =====
interface MenuItem {
  name: string;
  price: string;
}

interface PlaceDetailProps {
  focusReviewForm?: boolean;
}

// ===== Component =====
const PlaceDetail = ({ focusReviewForm = false }: PlaceDetailProps) => {
  // ===== Redux & Props =====
  const dispatch = useDispatch();
  const place = useSelector((state: RootState) => state.search.selectedDetailedPlace);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isMobile = window.innerWidth < 768;

  // ===== State =====
  const [selectedLanguage, setSelectedLanguage] = useState("영어");
  const [editMode, setEditMode] = useState(false);
  const [editedMenu, setEditedMenu] = useState<MenuItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageEditMode, setIsImageEditMode] = useState(false);

  // ===== Queries =====
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
    enabled: !!place,
    retry: (failureCount) => failureCount < 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
  });

  // ===== Effects =====
  useEffect(() => {
    setSelectedLanguage("영어");
    setEditMode(false);
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

  useEffect(() => {
    if (focusReviewForm) {
      setShowReviewForm(true);
      // 리뷰 폼이 렌더링된 후 textarea에 포커스
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.focus();
          // 스크롤도 리뷰 폼 위치로 이동
          textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [focusReviewForm]);

  // ===== Handlers =====
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

    const originalMenu = detailedInfo.menuOrTicketInfo || [];
    const hasChanges = JSON.stringify(originalMenu) !== JSON.stringify(filteredMenu);

    if (!hasChanges) {
      resetEditMode();
      return;
    }
  
    try {
      await submitChangeRequest(detailedInfo.id, filteredMenu, accessToken!);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      resetEditMode();
    } catch (err) {
      console.error(err);
      alert("Failed to submit change request.");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // ===== Render =====
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
                  pt-14 max-md:h-[80%] md:absolute md:top-1/2 md:-translate-y-1/2 md:left-2 md:w-[400px] md:h-[95%]"
      >
        {/* ===== Header ===== */}
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

        {/* ===== Content ===== */}
        <div className="flex flex-col overflow-auto h-full pr-2">
          {/* Basic Info */}
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

          {/* Loading & Error States */}
          {isLoading && (
            <div className="flex justify-center items-center mt-4">
              <FetchingUI />
            </div>
          )}
          {isError && (
            <p className="text-sm text-red-500 mt-4">❌ {error.message}</p>
          )}

          {/* Detailed Info */}
          {detailedInfo && (
            <div className="mt-4 pt-4 text-sm border-t border-[#B5CC88] mb-8">
              {/* Menu Section */}
              <div className="flex justify-end gap-2 mb-2">
                {!editMode ? (
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
                    <Icon path={mdiPencil} size={0.8} /> Suggest Changes
                  </button>
                ) : (
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

              {/* Menu List */}
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
                        onClick={() => setEditedMenu([...editedMenu, { name: '', price: '' }])}
                        className="text-sm text-green-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Icon path={mdiPlus} size={0.8} /> Add Menu Item
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

              {/* Reviews Section */}
              {Array.isArray(detailedInfo.translatedReviews) && detailedInfo.translatedReviews.length > 0 && (
                <div className="rounded-md mb-5">
                  <h3 className="font-bold text-[#34495E] text-base border-b border-[#D2B48C] pb-1 mb-2 flex items-center gap-2">
                    <Icon path={mdiCommentTextMultipleOutline} size={0.9} color="#34495E" />
                    Local Reviews
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

              {/* Reference Links Section */}
              {Array.isArray(detailedInfo.referenceUrls) && detailedInfo.referenceUrls.length > 0 && (
                <div className="rounded-md mb-5">
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
              {/* 리뷰 추가 버튼 및 폼 */}
              <div className="mt-4">
                {!showReviewForm ? (
                  <button
                    onClick={() => {
                      if (!accessToken) {
                        document.getElementById('login-button')?.click();
                        return;
                      }
                      setShowReviewForm(true);
                    }}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition inline-flex items-center gap-1"
                  >
                    <Icon path={mdiPlus} size={0.8} />
                    Add a review
                  </button>
                ) : (
                  <div className="mt-4 border border-gray-300 p-4 rounded-md bg-white">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Enter your review"
                      className="w-full border px-2 py-1 rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    
                    {/* 이미지 업로드 영역 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={handleImageClick}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition inline-flex items-center gap-1"
                          disabled={reviewImages.length >= 5}
                        >
                          <Icon path={mdiImagePlus} size={0.8} />
                          Add a photo ({reviewImages.length}/5)
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length + reviewImages.length > 5) {
                              alert("최대 5장의 이미지만 업로드할 수 있습니다.");
                              return;
                            }
                            setReviewImages((prev) => [...prev, ...files]);
                            setIsImageEditMode(false);
                          }}
                          className="hidden"
                        />
                      </div>

                      {/* 이미지 미리보기 */}
                      {reviewImages.length > 0 && (
                        <div className="relative">
                          <div className="flex justify-end mb-2">
                            <button
                              onClick={() => setIsImageEditMode(!isImageEditMode)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                isImageEditMode 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {isImageEditMode ? 'Cancel Edit' : 'Edit Photos'}
                            </button>
                          </div>
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            {reviewImages.map((img, idx) => (
                              <div 
                                key={idx} 
                                className="relative aspect-square border rounded overflow-hidden group cursor-pointer"
                                onClick={() => setSelectedImage(URL.createObjectURL(img))}
                              >
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt={`preview-${idx}`}
                                  className="object-cover w-full h-full"
                                />
                                {isImageEditMode && (
                                  <div 
                                    className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-10 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReviewImages((prev) => prev.filter((_, i) => i !== idx));
                                    }}
                                  >
                                    <Icon path={mdiMinusCircle} size={1} className="text-red-500 drop-shadow-lg" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          console.log("📝 작성한 리뷰", {
                            text: reviewText,
                            images: reviewImages,
                          });
                          alert("콘솔에 리뷰 정보가 출력되었습니다!");
                          setShowReviewForm(false);
                          setReviewText('');
                          setReviewImages([]);
                        }}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition inline-flex items-center gap-1"
                      >
                        <Icon path={mdiSend} size={0.8} />
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setShowReviewForm(false);
                          setReviewText('');
                          setReviewImages([]);
                        }}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition inline-flex items-center gap-1"
                      >
                        <Icon path={mdiCancel} size={0.8} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </motion.div>

      {/* Image Popup */}
      <ImagePopup
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
        onDelete={selectedImage ? () => {
          const index = reviewImages.findIndex(img => URL.createObjectURL(img) === selectedImage);
          if (index !== -1) {
            setReviewImages(prev => prev.filter((_, i) => i !== index));
          }
        } : undefined}
        isEditMode={isImageEditMode}
      />
    </>
  );
};

export default PlaceDetail;
