import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { KakaoPlaceSearchParams } from '../types';
import { useDispatch } from 'react-redux';
import { setSearchMeta } from '../store/slices/searchSlice';
import { convertKoreanToEnglishAddress } from "./utils/convertKoreanToEnglishAddress.ts";
import { translateCategoryToEnglish } from "./utils/translateCategoryToEnglish.ts";

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

      const meta = res.data?.meta;
      if (params && meta) {
        dispatch(setSearchMeta(meta));
      }


      const places = res.data.documents;

      const placesWithTranslatedData = await Promise.all(
        places.map(async (place: any) => {
          const roadAddr = place.road_address_name;
          const category = place.category_name;

          const [roadAddressNameEN, categoryNameEN] = await Promise.all([
            roadAddr ? convertKoreanToEnglishAddress(roadAddr) : null,
            category ? translateCategoryToEnglish(category) : null,
          ]);

          return {
            ...place,
            roadAddressNameEN,
            categoryNameEN,
          };
        })
      );

      return placesWithTranslatedData;
    },
    enabled: enabled &&
      typeof params?.query === 'string' &&
      params.query.trim().length > 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}