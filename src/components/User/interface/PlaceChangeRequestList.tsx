import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlaceInfoChangeRequests, approvePlaceInfoChangeRequest, rejectPlaceInfoChangeRequest, PlaceInfoChangeRequest } from '../utils/placeInfoRequests';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose } from '@mdi/js';
import { useState } from 'react';
import ToastMessage from '../../../interface/ToastMessage';
import ReviewReportList from './ReviewReportList';

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

const PlaceChangeRequestList = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isStaff = useSelector((state: RootState) => state.user.isStaff);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<number | null>(null);

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['placeChangeRequests'],
    queryFn: () => getPlaceInfoChangeRequests(accessToken!),
    enabled: !!accessToken,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => approvePlaceInfoChangeRequest(id, accessToken!),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['placeChangeRequests'] });
      
      const previousRequests = queryClient.getQueryData(['placeChangeRequests']);
      
      queryClient.setQueryData(['placeChangeRequests'], (oldData: PlaceInfoChangeRequest[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(request => 
          request.id === id ? { ...request, isApproved: true } : request
        );
      });
      
      return { previousRequests };
    },
    onSuccess: () => {
      setSuccessMessage('변경 요청이 승인되었습니다.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    },
    onError: (error: any, id, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(['placeChangeRequests'], context.previousRequests);
      }
      setErrorMessage(error.message || '변경 요청 승인 중 오류가 발생했습니다.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectPlaceInfoChangeRequest(id, accessToken!),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['placeChangeRequests'] });
      const previousRequests = queryClient.getQueryData(['placeChangeRequests']);
      
      queryClient.setQueryData(['placeChangeRequests'], (oldData: PlaceInfoChangeRequest[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(request => request.id !== id);
      });
      
      return { previousRequests };
    },
    onSuccess: () => {
      setSuccessMessage('변경 요청이 거절되었습니다.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    },
    onError: (error: any, id, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(['placeChangeRequests'], context.previousRequests);
      }
      setErrorMessage(error.message || '변경 요청 거절 중 오류가 발생했습니다.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    },
  });

  if (!isStaff) return null;

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading requests</div>;
  if (!requests?.length) return <div className="text-center py-4 text-gray-500">No change requests found</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <ToastMessage show={showSuccess} message={successMessage} type="success" />
        <ToastMessage show={showError} message={errorMessage} type="error" />
        <h2 className="text-xl font-bold text-gray-800 mb-4">장소 정보 변경 요청</h2>
        <div className="space-y-4">
          {requests.map((request: PlaceInfoChangeRequest) => {
            const newValue = JSON.parse(request.newValue);
            const status = request.isApproved === true ? 'approved' : 'pending';

            return (
              <div key={request.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div
                  className="flex justify-between items-start mb-2 cursor-pointer"
                  onClick={() => setOpenId(openId === request.id ? null : request.id)}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{request.placeInfo.name}</h3>
                    <p className="text-sm text-gray-600">{request.placeInfo.address}</p>
                    <p className="text-sm text-gray-500">
                      Requested by {request.user.name} ({request.user.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === 'pending' ? (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); approveMutation.mutate(Number(request.id)); }}
                          disabled={approveMutation.isPending}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition inline-flex items-center gap-1"
                        >
                          <Icon path={mdiCheck} size={0.8} /> Approve
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); rejectMutation.mutate(Number(request.id)); }}
                          disabled={rejectMutation.isPending}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition inline-flex items-center gap-1"
                        >
                          <Icon path={mdiClose} size={0.8} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded inline-flex items-center gap-1 bg-green-100 text-green-800">
                        <Icon path={mdiCheck} size={0.8} />
                        Approved
                      </span>
                    )}
                  </div>
                </div>

                {openId === request.id && (
                  <div className="mt-4 space-y-2">
                    <div className="border-t pt-2">
                      <h4 className="font-medium text-gray-700 mb-2">Menu Changes:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-1">Current Menu:</h5>
                          <ul className="text-sm space-y-1">
                            {request.placeInfo.menuOrTicketInfo?.map((item, idx) => (
                              <li key={idx} className="text-gray-600">
                                {item.name} — {item.price}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-1">Requested Changes:</h5>
                          <ul className="text-sm space-y-1">
                            {newValue?.map((item: { name: string; price: string }, idx: number) => (
                              <li key={idx} className="text-gray-600">
                                {item.name} — {item.price}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-8">
        <ReviewReportList />
      </div>
    </div>
  );
};

export default PlaceChangeRequestList; 