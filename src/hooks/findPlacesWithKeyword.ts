import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { KakaoPlaceSearchParams } from '../types';
import { useDispatch } from 'react-redux';
import { setSearchMeta } from '../store/slices/searchSlice';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export function useKakaoPlaces(params: KakaoPlaceSearchParams, enabled: boolean) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['kakaoPlaces', params],
    queryFn: async () => {
      const res = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
        params,
      });
      console.log('호출');

      if (params.page === 1 && res.data.meta) {
        dispatch(setSearchMeta(res.data.meta));
      }

      return res.data.documents;
    },
    enabled: enabled && !!params.query,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}