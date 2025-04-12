// src/utils/mapCenterResearch.ts
import queryString from 'query-string';
import { NavigateFunction } from 'react-router-dom';

/**
 * 현재 지도 중심 좌표로 다시 검색을 수행하는 유틸 함수
 * 쿼리에서 food, sights 값을 읽고, type=coord로 설정한 후 이동
 */
export const mapCenterResearch = (
  mapInstance: any,
  navigate: NavigateFunction,
  locationSearch: string
) => {
  if (!mapInstance) return;

  const center = mapInstance.getCenter();
  const x = center.lng();
  const y = center.lat();

  // 현재 URL에서 쿼리 파라미터 추출
  const { food, sights } = queryString.parse(locationSearch);

  const query = queryString.stringify({
    type: 'coord',
    x,
    y,
    food,
    sights,
  });

  navigate(`/map?${query}`);
};
