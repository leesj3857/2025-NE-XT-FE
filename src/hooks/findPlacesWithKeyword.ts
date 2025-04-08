import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { KakaoPlaceSearchParams } from '../types';
const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export function useKakaoPlaces(params: KakaoPlaceSearchParams, enabled: boolean) {

  return useQuery({
    queryKey: ['kakaoPlaces', params],
    queryFn: async () => {
      const res = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
        params,
      });
      console.log('호출')
      return res.data.documents;
    },
    enabled: enabled && !!params.query,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
