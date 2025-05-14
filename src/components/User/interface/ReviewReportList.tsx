import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviewReports, approveReviewReport, rejectReviewReport, ReviewReport } from '../utils/placeInfoRequests';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiStar } from '@mdi/js';
import { useState } from 'react';
import ToastMessage from '../../../interface/ToastMessage';
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

const ReviewReportList = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isStaff = useSelector((state: RootState) => state.user.isStaff);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['reviewReports'],
    queryFn: () => getReviewReports(accessToken!),
    enabled: !!accessToken,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => approveReviewReport(id, accessToken!),
    onMutate: async (id) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: ['reviewReports'] });
      
      // 이전 데이터 저장
      const previousReports = queryClient.getQueryData(['reviewReports']);
      
      // 낙관적 업데이트
      queryClient.setQueryData(['reviewReports'], (oldData: ReviewReport[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(report => report.id !== id);
      });
      
      return { previousReports };
    },
    onSuccess: (_, id) => {
      setSuccessMessage('리뷰 신고가 승인되었습니다.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      setOpenId(null);
    },
    onError: (error: any, id, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousReports) {
        queryClient.setQueryData(['reviewReports'], context.previousReports);
      }
      setErrorMessage(error.message || '리뷰 신고 승인 중 오류가 발생했습니다.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectReviewReport(id, accessToken!),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['reviewReports'] });
      const previousReports = queryClient.getQueryData(['reviewReports']);
      
      queryClient.setQueryData(['reviewReports'], (oldData: ReviewReport[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(report => report.id !== id);
      });
      
      return { previousReports };
    },
    onSuccess: (_, id) => {
      setSuccessMessage('리뷰 신고가 거절되었습니다.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      setOpenId(null);
    },
    onError: (error: any, id, context) => {
      if (context?.previousReports) {
        queryClient.setQueryData(['reviewReports'], context.previousReports);
      }
      setErrorMessage(error.message || '리뷰 신고 거절 중 오류가 발생했습니다.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    },
  });

  if (!isStaff) return null;

  if (isLoading) return <div className="text-center py-4">로딩 중...</div>;
  if (error) return <div className="text-center py-4 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!reports?.length) return <div className="text-center py-4 text-gray-500">신고된 리뷰가 없습니다.</div>;

  const validReports = reports.filter(report =>
    report &&
    report.placeReview &&
    report.placeReview.placeInfo &&
    report.placeReview.user
  );

  if (!validReports.length) return <div className="text-center py-4 text-gray-500">유효한 신고 데이터가 없습니다.</div>;

  return (
    <div className="space-y-4">
      <ToastMessage show={showSuccess} message={successMessage} />
      <ToastMessage show={showError} message={errorMessage} type="error" />
      <h2 className="text-xl font-bold text-gray-800 mb-4">리뷰 신고 목록</h2>
      <div className="space-y-4">
        {validReports.map((report: ReviewReport) => (
          <div key={report.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div
              className="flex justify-between items-start mb-2 cursor-pointer"
              onClick={() => setOpenId(openId === report.id ? null : report.id)}
            >
              <div>
                <h3 className="font-semibold text-lg">{report.placeReview.placeInfo.name}</h3>
                <p className="text-sm text-gray-600">리뷰 작성자 ID: {report.placeReview.user.id}</p>
                <p className="text-sm text-gray-600">리뷰 작성자: {report.placeReview.user.name} ({report.placeReview.user.email})</p>
                <p className="text-sm text-gray-500">
                  신고 일시: {formatDate(report.createdAt)}
                </p>
                {report.reason && (
                  <p className="text-sm text-gray-500 mt-1">
                    신고 사유: {report.reason}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    approveMutation.mutate(report.id);
                  }}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  className="w-full sm:w-auto mb-2 sm:mb-0 px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition inline-flex items-center gap-1 justify-center"
                >
                  <Icon path={mdiCheck} size={0.8} /> 승인
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    rejectMutation.mutate(report.id);
                  }}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  className="w-full sm:w-auto px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition inline-flex items-center gap-1 justify-center"
                >
                  <Icon path={mdiClose} size={0.8} /> 거절
                </button>
              </div>
            </div>

            {openId === report.id && (
              <div className="mt-4 space-y-2">
                <div className="border-t pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-700">신고된 리뷰:</h4>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {(() => {
                        const rating = typeof report.placeReview.rating === 'number' ? report.placeReview.rating : 0;
                        return rating > 0 ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <Icon
                              key={i}
                              path={mdiStar}
                              size={0.8}
                              className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))
                        ) : (
                          Array.from({ length: 5 }).map((_, i) => (
                            <Icon
                              key={i}
                              path={mdiStar}
                              size={0.8}
                              className="text-gray-300"
                            />
                          ))
                        );
                      })()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap mb-3">
                      {report.placeReview.text}
                    </p>
                    {report.placeReview.images && report.placeReview.images.length > 0 && (
                      <div className="max-w-[300px] grid grid-cols-4 gap-1">
                        {report.placeReview.images.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="aspect-square rounded overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image}
                              alt={`리뷰 이미지 ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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

export default ReviewReportList; 