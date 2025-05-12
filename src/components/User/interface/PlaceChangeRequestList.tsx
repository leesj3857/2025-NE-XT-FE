import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlaceInfoChangeRequests, approvePlaceInfoChangeRequest, rejectPlaceInfoChangeRequest, PlaceInfoChangeRequest } from '../utils/placeChangeRequest';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiClockOutline } from '@mdi/js';
import { useState } from 'react';
import ToastMessage from '../../../interface/ToastMessage';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<number | null>(null);

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['placeChangeRequests'],
    queryFn: () => getPlaceInfoChangeRequests(accessToken!),
    enabled: !!accessToken,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => approvePlaceInfoChangeRequest(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placeChangeRequests'] });
      setSuccessMessage('Request approved successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectPlaceInfoChangeRequest(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placeChangeRequests'] });
      setSuccessMessage('Request rejected successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    },
  });

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading requests</div>;
  if (!requests?.length) return <div className="text-center py-4 text-gray-500">No change requests found</div>;

  return (
    <div className="space-y-4">
      <ToastMessage show={showSuccess} message={successMessage} />
      <h2 className="text-xl font-bold text-gray-800 mb-4">Place Change Requests</h2>
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
                          {newValue.menuOrTicketInfo?.map((item: { name: string; price: string }, idx: number) => (
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
  );
};

export default PlaceChangeRequestList; 