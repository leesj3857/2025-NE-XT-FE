import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../store";
import { clearSelectedDetailedPlace } from "../../../store/slices/searchSlice.ts";
import Icon from '@mdi/react';
import {
  mdiClose, mdiClipboardTextOutline,
  mdiCommentTextMultipleOutline,
  mdiMapMarker, mdiLink, mdiPencil,
  mdiCheck,
  mdiCloseCircleOutline,
  mdiPlus,
  mdiImagePlus,
  mdiSend,
  mdiCancel,
  mdiMinusCircle,
  mdiStar,
  mdiStarOutline,
  mdiAccountCircle,
  mdiClockOutline,
  mdiAlarmLight,
  mdiBookmarkOutline,
  mdiRefresh
} from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
import { getPlaceInfo, submitChangeRequest, createPlaceReview, reportReview, fileToBase64, getPlaceReviews } from '../utils/getPlaceInfoClient';
import FetchingUI from './FetchingUI.tsx';
import { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector.tsx';
import ToastMessage from '../../../interface/ToastMessage';
import ImagePopup from '../../../interface/ImagePopup';
import DeleteModal from '../../../interface/DeleteModal';
import { useQueryClient } from '@tanstack/react-query';
import { optimizeImage, validateImageSize, getFileSizeInMB } from '../utils/imageOptimizer';
import SavePlaceModal from './SavePlaceModal';


interface MenuItem {
  name: string;
  price: string;
}

interface ReviewFormData {
  text: string;
  images: File[];
  rating: number;
}

interface ReportData {
  reviewId: string;
  reason: string;
}

interface PlaceDetailProps {
  focusReviewForm?: boolean;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface Review {
  id: string;
  text: string;
  rating: number;
  images: string[];
  createdAt: string;
  user: {
    name: string;
  };
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_BASE64_SIZE = 1 * 1024 * 1024; // 1MB

const PlaceDetail = ({ focusReviewForm = false }: PlaceDetailProps) => {
  const dispatch = useDispatch();
  const place = useSelector((state: RootState) => state.search.selectedDetailedPlace);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isMobile = window.innerWidth < 768;
  const { categories, email } = useSelector((state: RootState) => state.user);
  const currentCategory = categories.find(c =>
    c.places.some(p => p.id === place?.id)
  );
  const bookmarkColor = currentCategory?.color;
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [editMode, setEditMode] = useState(false);
  const [editedMenu, setEditedMenu] = useState<MenuItem[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewFormData>({
    text: '',
    images: [],
    rating: 0
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageEditMode, setIsImageEditMode] = useState(false);
  const hasFocusedRef = useRef(false);
  const MAX_REVIEW_LENGTH = 150;
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const queryClient = useQueryClient();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [languageReady, setLanguageReady] = useState(true);


  const {
    data: detailedInfo,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isSuccess,
    isError: isQueryError,
  } = useQuery({
    queryKey: ['placeInfo', place?.placeName, place?.roadAddressName, selectedLanguage],
    queryFn: () => {
      if (!place) throw new Error('No place selected');
      return getPlaceInfo(place.placeName!, place.roadAddressName!, selectedLanguage);
    },
    enabled: !!place && languageReady,
    retry: (failureCount) => failureCount < 5,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 3000),
  });

  const {
    data: reviews,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['placeReviews', detailedInfo?.id],
    queryFn: () => {
      if (!detailedInfo?.id) throw new Error('No place selected');
      return getPlaceReviews(detailedInfo.id);
    },
    enabled: !!detailedInfo?.id,
  });

  useEffect(() => {
    setSelectedLanguage("English");
    setEditMode(false);
    setLanguageReady(true);
    if (place) {
      hasFocusedRef.current = false;
    }
  }, [place]);

  useEffect(() => {
    if (detailedInfo) {
      const container = document.querySelector('#place-detail-container');
      if (container) {
        setShowReviewForm(false);
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [detailedInfo]);

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
    if (!isFetching && languageReady) {
      setLanguageReady(false);
    }
  }, [isFetching, languageReady]);

  useEffect(() => {
    if (focusReviewForm && !hasFocusedRef.current) {
      setShowReviewForm(true);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              textarea.focus();
              textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
              hasFocusedRef.current = true;
              observer.disconnect();
            }
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    }
    else {
      setShowReviewForm(false);
      const container = document.querySelector('#place-detail-container');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [focusReviewForm]);

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
      setToast({ message: "Please provide valid menu items.", type: 'error' });
      setTimeout(() => setToast(null), 1000);
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
      setToast({ message: "Change request submitted successfully!", type: 'success' });
      setTimeout(() => setToast(null), 1000);
      resetEditMode();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to submit change request.", type: 'error' });
      setTimeout(() => setToast(null), 1000);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const processImageFiles = async (files: File[]): Promise<File[]> => {
    const processedFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        if (!validateImageSize(file)) {
          errors.push(`${file.name} (${getFileSizeInMB(file.size)}MB) must be less than 5MB.`);
          continue;
        }

        const optimizedFile = await optimizeImage(file);
        if (optimizedFile.size > MAX_BASE64_SIZE) {
          errors.push(`Unable to compress ${file.name} to a suitable size. Please try a different image.`);
          continue;
        }
        processedFiles.push(optimizedFile);
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        errors.push(`Error processing ${file.name}: ${errorMessage}`);
      }
    }

    if (errors.length > 0) {
      setToast({ 
        message: errors.join('\n'), 
        type: 'error' 
      });
      setTimeout(() => setToast(null), 3000);
    }

    return processedFiles;
  };

  const StarRating = ({ rating, onRatingChange, hoveredRating, onHoverChange }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    hoveredRating: number;
    onHoverChange: (rating: number) => void;
  }) => {
    return (
      <div
        className="flex items-center gap-0.5 relative"
        onMouseLeave={() => onHoverChange(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="relative w-6 h-6 flex items-center justify-center"
            onMouseEnter={() => onHoverChange(star)}
          >
            <button
              type="button"
              onClick={() => onRatingChange(star)}
              className="absolute inset-0 focus:outline-none"
              aria-label={`Rate ${star} out of 5`}
            />
            <Icon
              path={star <= (hoveredRating || rating) ? mdiStar : mdiStarOutline}
              size={1.2}
              className={`transition-colors duration-150 ${star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
                }`}
            />
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setReviewData({ text: '', images: [], rating: 0 });
    hasFocusedRef.current = false;
  };

  const handleReportClick = (reviewId: string) => {
    setReportData({ reviewId, reason: '' });
    setShowReportModal(true);
  };

  const handleReportConfirm = async (reason?: string) => {
    if (!reportData) {
      setToast({ message: "Please provide a reason for reporting.", type: 'error' });
      setTimeout(() => setToast(null), 1000);
      return;
    }

    try {
      const result = await reportReview(reportData.reviewId, reason);
      if (result.message) {
        setToast({ message: result.message, type: 'success' });
        setTimeout(() => setToast(null), 1000);
        setShowReportModal(false);
        setReportData(null);
      }
    } catch (error) {
      setToast({ message: "Error reporting review.", type: 'error' });
      setTimeout(() => setToast(null), 1000);
    }
  };

  const handleSubmitReview = async () => {
    if (!accessToken || !detailedInfo?.id) {
      setToast({ message: "Please login to continue.", type: 'error' });
      setTimeout(() => setToast(null), 1000);
      return;
    }

    try {
      if (reviewData.images.length > 0) {
        setToast({ message: "Processing images...", type: 'success' });
      }

      const processedImages = await Promise.all(
        reviewData.images.map(async (file) => {
          try {
            const optimizedFile = await optimizeImage(file);
            if (optimizedFile.size > MAX_BASE64_SIZE) {
              throw new Error(`Image ${file.name} is too large after optimization`);
            }
            return await fileToBase64(optimizedFile);
          } catch (error: any) {
            throw new Error(`Error processing image '${file.name}': ${error.message}`);
          }
        })
      );

      const result = await createPlaceReview(
        detailedInfo.id,
        reviewData.text,
        reviewData.rating,
        processedImages,
        accessToken
      );

      if (result.message) {
        setToast({ message: result.message, type: 'success' });
        setTimeout(() => setToast(null), 1000);
        setShowReviewForm(false);
        setReviewData({ text: '', images: [], rating: 0 });
        
        await refetchReviews();
        
        queryClient.invalidateQueries({ 
          queryKey: ['placeInfo', place?.placeName, place?.roadAddressName, selectedLanguage] 
        });
      }
    } catch (error: any) {
      let errorMessage = "An error occurred while writing the review.";
      
      if (error.message) {
        if (error.message.includes('image')) {
          errorMessage = error.message;
        } else if (error.message.includes('network')) {
          errorMessage = "Please check your network connection.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes('unauthorized')) {
          errorMessage = "Your login has expired. Please login again.";
        } else if (error.message.includes('413')) {
          errorMessage = "The image is too large. Please try a smaller image.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      setToast({ 
        message: errorMessage,
        type: 'error' 
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    setLanguageReady(true);
  }, [selectedLanguage]);

  return (
    <>
      <ToastMessage 
        show={!!toast} 
        message={toast?.message || ''} 
        type={toast?.type || 'success'} 
      />
      <motion.div
        initial={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
        animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
        exit={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ zIndex: 100 }}
        className="p-4 rounded-xl shadow-xl bg-[#FAFAFA]
                  max-md:fixed max-md:top-1/2 max-md:w-5/6 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 
                  pt-4 max-md:h-[80%] md:absolute md:top-1/2 md:-translate-y-1/2 md:left-2 md:w-[400px] md:h-[95%] flex flex-col"
      >
        {/* ===== Header ===== */}
        <div className="flex justify-between items-center mb-4">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!email) {
                  document.getElementById('login-button')?.click();
                  return;
                } else {
                  setShowSaveModal(true);
                }
              }}
              className="text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <Icon path={mdiBookmarkOutline} size={1.2} color={bookmarkColor} />
            </button>
            <button
              onClick={() => dispatch(clearSelectedDetailedPlace())}
              className="text-gray-400 hover:text-black"
              aria-label="Close detail"
            >
              <Icon path={mdiClose} size={1} />
            </button>
          </div>
        </div>

        {/* ===== Content ===== */}
        <div className="flex flex-col overflow-auto  pr-2" id="place-detail-container flex-1">
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
            <div className="text-sm text-gray-600 mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="mb-2">We're having trouble loading the place information due to high server traffic.</p>
              <p className="mb-3">Please wait a moment and try again. The information should be available shortly.</p>
              <button
                onClick={() => refetch()}
                className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors inline-flex items-center gap-2"
              >
                <Icon path={mdiRefresh} size={0.8} />
                Try Again
              </button>
            </div>
          )}

          {/* Detailed Info */}
          {detailedInfo && (
            <div className="mt-4 pt-4 text-sm border-t border-[#B5CC88] mb-8">
              {/* Menu Section */}
              <div className="flex justify-end gap-2 mb-2">
                {!editMode ? (
                  <button
                    onClick={() => {
                      if (!accessToken) {
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

              {/* Local Reviews Section */}
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
                        className="border border-[#8D6E63] p-2 rounded-md bg-[#FAFAFA] break-words whitespace-pre-wrap"
                      >
                        {review}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* User Reviews Section */}
              <div className="rounded-md mb-5">
                <h3 className="font-bold text-[#E67E22] text-base border-b border-[#F5B041] pb-1 mb-2 flex items-center gap-2">
                  <Icon path={mdiAccountCircle} size={0.9} color="#E67E22" />
                  User Reviews
                </h3>
                <div className="space-y-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review: Review) => (
                      <div key={review.id} className="border border-[#F5B041] p-3 rounded-md bg-white">
                        <div className="flex flex-col gap-1 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-[#E67E22]">{review.user.name}</span>
                            <button
                              onClick={() => handleReportClick(review.id)}
                              className="text-red-500 hover:text-red-600 transition-colors p-1"
                              title="Report inappropriate content"
                            >
                              <Icon path={mdiAlarmLight} size={0.8} color="red" />
                            </button>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Icon
                                key={star}
                                path={star <= review.rating ? mdiStar : mdiStarOutline}
                                size={0.8}
                                className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Icon path={mdiClockOutline} size={0.7} />
                            <span>{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-[#555555] mb-3 break-words whitespace-pre-wrap">{review.text}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {review.images.map((image: string, idx: number) => (
                              <div
                                key={idx}
                                className="aspect-square rounded overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                              >
                                <img
                                  src={image}
                                  alt={`Review image ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="border border-[#F5B041] p-6 rounded-md bg-white text-center">
                      <Icon path={mdiCommentTextMultipleOutline} size={2} className="text-[#F5B041] mx-auto mb-3" />
                      <p className="text-[#555555] mb-2">No reviews have been written yet.</p>
                      <p className="text-sm text-[#888888]">Write the first review to help other visitors!</p>
                    </div>
                  )}
                </div>
              </div>

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
                    {/* 별점 컴포넌트 추가 */}
                    <div className="mb-4">
                      <StarRating
                        rating={reviewData.rating}
                        onRatingChange={(rating) => setReviewData(prev => ({ ...prev, rating }))}
                        hoveredRating={hoveredRating}
                        onHoverChange={setHoveredRating}
                      />
                    </div>

                    <div className="relative">
                      <textarea
                        value={reviewData.text}
                        onChange={(e) => {
                          const text = e.target.value;
                          if (text.length <= MAX_REVIEW_LENGTH) {
                            setReviewData(prev => ({ ...prev, text }));
                          }
                        }}
                        placeholder="Enter your review"
                        className="w-full border px-2 py-1 rounded mb-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                        {reviewData.text.length}/{MAX_REVIEW_LENGTH}
                      </div>
                    </div>

                    {/* 이미지 업로드 영역 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={handleImageClick}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition inline-flex items-center gap-1"
                          disabled={reviewData.images.length >= 4}
                        >
                          <Icon path={mdiImagePlus} size={0.8} />
                          Add a photo ({reviewData.images.length}/4)
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length + reviewData.images.length > 4) {
                              setToast({ message: "Maximum 4 images can be uploaded.", type: 'error' });
                              setTimeout(() => setToast(null), 1000);
                              return;
                            }

                            const processedFiles = await processImageFiles(files);
                            if (processedFiles.length > 0) {
                              setReviewData(prev => ({ ...prev, images: [...prev.images, ...processedFiles] }));
                              setIsImageEditMode(false);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">Large image files cannot be uploaded.</p>
                      {/* 이미지 미리보기 */}
                      {reviewData.images.length > 0 && (
                        <div className="relative">
                          <div className="flex justify-end mb-2">
                            <button
                              onClick={() => setIsImageEditMode(!isImageEditMode)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${isImageEditMode
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {isImageEditMode ? 'Cancel Edit' : 'Edit Photos'}
                            </button>
                          </div>
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            {reviewData.images.map((img, idx) => (
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
                                      setReviewData(prev => ({
                                        ...prev,
                                        images: prev.images.filter((_, i) => i !== idx)
                                      }));
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
                        onClick={handleSubmitReview}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition inline-flex items-center gap-1"
                      >
                        <Icon path={mdiSend} size={0.8} />
                        Submit
                      </button>
                      <button
                        onClick={handleCloseReviewForm}
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
          const index = reviewData.images.findIndex(img => URL.createObjectURL(img) === selectedImage);
          if (index !== -1) {
            setReviewData(prev => ({
              ...prev,
              images: prev.images.filter((_, i) => i !== index)
            }));
          }
        } : undefined}
        isEditMode={isImageEditMode}
      />

      {/* Report Modal */}
      <DeleteModal
        show={showReportModal}
        title="Report Review"
        message={
          reportData && detailedInfo?.reviews?.find(r => r.id === reportData.reviewId)
            ? `Reporting review by ${detailedInfo?.reviews?.find(r => r.id === reportData.reviewId)?.user.name}. Please report any inappropriate content. We will review and take appropriate action.`
            : 'Please report any inappropriate content. We will review and take appropriate action.'
        }
        onCancel={() => {
          setShowReportModal(false);
          setReportData(null);
        }}
        onConfirm={handleReportConfirm}
        cancelText="Cancel"
        confirmText="Report"
        showReasonInput={true}
        reasonPlaceholder="Please provide details about why you are reporting this review (optional)"
      />

      {showSaveModal && place && (
        <SavePlaceModal
          place={place}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </>
  );
};

export default PlaceDetail;
