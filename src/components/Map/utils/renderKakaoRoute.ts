// src/components/Map/utils/renderKakaoRoute.ts
import axios from "axios";
import {kakaoRouteErrorMap} from "../static/errorCodeMap.ts";
import {setRouteErrorMessage} from "../../../store/slices/searchSlice.ts";

interface Coordinate {
  lat?: number | string;
  lng?: number | string;
}

let routeLine: naver.maps.Polyline | null = null;

export const renderKakaoRouteOnNaverMap = async (
  mapInstance: any,
  origin: Coordinate,
  destination: Coordinate,
  dispatch: any,
) => {
  if (!mapInstance || !window.naver) return;
  const url = "https://apis-navi.kakaomobility.com/v1/directions";

  const params = {
    origin: `${origin.lng},${origin.lat}`,
    destination: `${destination.lng},${destination.lat}`,
    priority: "RECOMMEND",
  };

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
      },
      params,
    });
    const route = response.data?.routes?.[0];
    if (!route || !route.sections?.[0]?.roads?.length) {
      const errorCode = route?.result_code || response.data?.routes?.[0]?.result_code || 104;
      const errorMsg = kakaoRouteErrorMap[errorCode] || "Unknown error occurred during route search.";

      dispatch(setRouteErrorMessage(errorMsg)); // 새 액션 필요
      return;
    }

    const roads = response.data?.routes?.[0]?.sections?.[0]?.roads || [];
    const { summary } = response.data?.routes?.[0] || {};
    const durationMs = summary?.duration;
    const distanceM = summary?.distance;

    if (!roads.length) {
      console.warn("경로 데이터를 찾을 수 없습니다.");
      return;
    }

    const path: naver.maps.LatLng[] = roads.flatMap((road: any) => {
      const points: naver.maps.LatLng[] = [];
      for (let i = 0; i < road.vertexes.length; i += 2) {
        const lng = road.vertexes[i];
        const lat = road.vertexes[i + 1];
        points.push(new window.naver.maps.LatLng(lat, lng));
      }
      return points;
    });

    if (routeLine) {
      routeLine.setMap(null);
    }

    routeLine = new window.naver.maps.Polyline({
      path,
      strokeColor: "\t#6366F1",
      strokeWeight: 6,
      strokeOpacity: 0.8,
      strokeLineCap: "round",
      strokeLineJoin: "round",
      map: mapInstance,
    });

    // 경로 중심으로 이동
    const middleIndex = Math.floor(path.length / 2);
    // mapInstance.setCenter(path[middleIndex]);

    return {
      polyline: routeLine,
      duration: durationMs,
      distance: distanceM,
    };
  } catch (error) {
    console.error("카카오 길찾기 API 요청 실패:", error);
  }
};
