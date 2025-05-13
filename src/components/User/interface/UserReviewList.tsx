import { useQuery } from '@tanstack/react-query';
import { getUserReviews, UserReview } from '../utils/placeInfoRequests';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Icon from '@mdi/react';
import { mdiStar, mdiStarOutline, mdiClockOutline, mdiImage } from '@mdi/js';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImagePopup from '../../../interface/ImagePopup';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const UserReviewList = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['userReviews'],
    queryFn: () => getUserReviews(accessToken!),
    enabled: !!accessToken,
  });

  if (!accessToken) return null;
  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading reviews</div>;
  if (!reviews?.length) return (
    <div className="text-center py-8 border rounded-lg bg-gray-50">
      <p className="text-gray-500">아직 작성한 리뷰가 없습니다.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">내가 작성한 리뷰</h2>
      <div className="space-y-4">
        {reviews.map((review: UserReview) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div
              className="cursor-pointer"
              onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{review.placeInfo.name}</h3>
                  <p className="text-gray-500 text-sm">{review.placeInfo.address}</p>
                  <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        path={star <= review.rating ? mdiStar : mdiStarOutline}
                        size={0.8}
                        className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <Icon path={mdiClockOutline} size={0.7} />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                {review.images && review.images.length > 0 && (
                  <div className="flex items-center gap-1 text-gray-500 max-md:pt-0.5">
                    <Icon path={mdiImage} size={0.8} />
                    <span className="text-sm">{review.images.length}</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {expandedReviewId === review.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <p className="text-gray-700 whitespace-pre-wrap">{review.text}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {review.images.map((image, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded overflow-hidden cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image);
                            }}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <ImagePopup
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </div>
  );
};

export default UserReviewList; 